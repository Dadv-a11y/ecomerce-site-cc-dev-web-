let userData = JSON.parse(localStorage.getItem('userData')) || [];
let nombreUtilisateur = document.getElementById('nombreUtilisateur')
nombreUtilisateur.appendChild(document.createTextNode(userData.length))
function createCard(user) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <h3>${user.name}</h3>
        <p>Email: ${user.email}</p>
         <p>nom utilisateur : ${user.username}</p>
    `;
    return card;
}

function populateDashboard() {
    let i = 0 
    const dashboard = document.getElementById('dashboard');
    userData.forEach(user => {
        const card = createCard(user);
        i++
        dashboard.appendChild(card);
    });
}

async function fetchCatalogue() {
    const response = await fetch('../catalogue.json');
    const catalogue = await response.json();
    return catalogue;
}

function categorizeData(catalogue) {
    const categories = {};
    catalogue.forEach(item => {
        if (!categories[item.categorie]) {
            categories[item.categorie] = 0;
        }
        categories[item.categorie]++;
    });
    return categories;
}

function createChart(categories) {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                label: 'nombre d element ',
                data: Object.values(categories),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
      
async function getProductCategories() {
    const response = await fetch('../catalogue.json');
    const catalogue = await response.json();
    const categoryMap = {};
    catalogue.forEach(item => {
        categoryMap[item.nom] = item.categorie;
    });
    return categoryMap;
}

async function createSalesChart() {
    const tableauStatistique = JSON.parse(localStorage.getItem('tableauStatistique')) || [];
    const categoryMap = await getProductCategories();
    
    // Group sales by category
    const categorySales = {};
    let totalSales = 0;
    
    tableauStatistique.forEach(sale => {
        const category = categoryMap[sale.nom];
        if (!categorySales[category]) {
            categorySales[category] = 0;
        }
        categorySales[category] += sale.quantite;
        totalSales += sale.quantite;
    });
    
    // Calculate percentages
    const categoryPercentages = {};
    for (let category in categorySales) {
        categoryPercentages[category] = ((categorySales[category] / totalSales) * 100).toFixed(2);
    }
    
    // Create pie chart
    const ctx = document.getElementById('salesChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(categoryPercentages),
            datasets: [{
                data: Object.values(categoryPercentages),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)'
                ]
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Pourcentage des ventes par catégorie'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    });
}

function createSortedTable() {
const catalogue =  JSON.parse(localStorage.getItem('tableauStatistique')) || [];

// pour classer de facon ascendante
const sortedData = catalogue.sort((a, b) => b.quantite - a.quantite);
let bestProduct = [ sortedData[0].nom , sortedData[1].nom , sortedData[3].nom]
localStorage.setItem('bestProduct', bestProduct)

const tableHTML = `
    <table id="productTable" style="width: 100%; margin-top: 20px; border-collapse: collapse;">
        <thead>
            <tr style="background-color: #f2f2f2;">
                <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Catégorie</th>
                <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Nom</th>
                <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Quantité</th>
            </tr>
        </thead>
        <tbody>
            ${sortedData.map(item => `
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">${item.categorie}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${item.nom}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${item.quantite}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
`;

document.body.insertAdjacentHTML('beforeend', tableHTML);
}

// pour remplir la page dashboard
async function init() {
    const catalogue = await fetchCatalogue();
    populateDashboard()
    const categories = categorizeData(catalogue);
    createChart(categories);
    await createSalesChart();
     createSortedTable(); 
}

init();