// Mock Database Inicial de Imóveis
const INITIAL_PROPERTIES = [
  {
    id: 1,
    title: "Apartamento de Luxo com Vista para o Mar",
    type: "Apartamento",
    purpose: "Venda",
    price: 1250000,
    address: "Av. Beira Mar, 1020 - Meireles, Fortaleza - CE",
    city: "Fortaleza",
    bedrooms: 3,
    bathrooms: 3,
    garage: 2,
    area: 142,
    featured: true,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    description: "Lindo apartamento reformado, vista total para o mar, varanda gourmet com churrasqueira, móveis planejados em todos os ambientes e condomínio com área de lazer completa."
  },
  {
    id: 2,
    title: "Casa Contemporânea em Condomínio Fechado",
    type: "Casa",
    purpose: "Venda",
    price: 2400000,
    address: "Al. dos Eucaliptos, 450 - Alphaville, Barueri - SP",
    city: "Barueri",
    bedrooms: 4,
    bathrooms: 5,
    garage: 4,
    area: 380,
    featured: true,
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
    description: "Casa neoclássica moderna com pé direito duplo, suíte master com closet e hidromassagem, piscina aquecida com borda infinita e energia solar instalada."
  },
  {
    id: 3,
    title: "Cobertura Duplex no Coração do Jardins",
    type: "Cobertura",
    purpose: "Venda",
    price: 3800000,
    address: "Rua Oscar Freire, 890 - Jardins, São Paulo - SP",
    city: "São Paulo",
    bedrooms: 4,
    bathrooms: 4,
    garage: 3,
    area: 290,
    featured: true,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    description: "Exclusiva cobertura duplex com terraço privativo, jacuzzi ao ar livre e vista panorâmica 360° da cidade. Acabamentos em mármore e madeira nobre."
  },
  {
    id: 4,
    title: "Apartamento Studio Moderno proximo ao Metrô",
    type: "Apartamento",
    purpose: "Aluguel",
    price: 3200,
    address: "Rua Consolação, 1500 - Consolação, São Paulo - SP",
    city: "São Paulo",
    bedrooms: 1,
    bathrooms: 1,
    garage: 1,
    area: 45,
    featured: false,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    description: "Studio totalmente mobiliado e decorado por arquiteto, ar-condicionado, varanda integrada e infraestrutura completa de coworking e academia no prédio."
  },
  {
    id: 5,
    title: "Terreno Plano em Condomínio de Alto Padrão",
    type: "Terreno",
    purpose: "Venda",
    price: 650000,
    address: "Av. das Palmeiras, Lote 12 - Quinta da Baroneza, Bragança Paulista - SP",
    city: "Bragança Paulista",
    bedrooms: 0,
    bathrooms: 0,
    garage: 0,
    area: 800,
    featured: false,
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    description: "Excelente terreno pronto para construir, topografia plana, localizado na área mais alta do condomínio com vista privilegiada para o vale."
  },
  {
    id: 6,
    title: "Casa Achechegante com Quintal e Piscina",
    type: "Casa",
    purpose: "Aluguel",
    price: 7500,
    address: "Rua das Laranjeiras, 320 - Laranjeiras, Rio de Janeiro - RJ",
    city: "Rio de Janeiro",
    bedrooms: 3,
    bathrooms: 2,
    garage: 2,
    area: 210,
    featured: false,
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    description: "Charmosa casa de bairro em rua silenciosa e arborizada. Amplo quintal verde com piscina, área gourmet com churrasqueira e espaço pet."
  }
];

// Estados da Aplicação
let properties = [...INITIAL_PROPERTIES];
let favorites = JSON.parse(localStorage.getItem('imobprime_favorites')) || [];
let currentFilterPurpose = '';
let currentFilterBedrooms = 0;

// Inicialização
window.onload = function() {
  updateFavoritesBadge();
  renderFeaturedProperties();
  applyFilters();
  calculateFinancing();
};

// Alternar Navegação entre telas (SPA pattern)
function navigateTo(viewName) {
  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
  const targetView = document.getElementById(`view-${viewName}`);
  if(targetView) {
    targetView.classList.add('active');
  }

  // Atualiza estilo dos botões da navbar
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('text-emerald-400');
    btn.classList.add('text-slate-300');
  });
  const activeBtn = document.getElementById(`nav-${viewName}`);
  if(activeBtn) {
    activeBtn.classList.add('text-emerald-400');
    activeBtn.classList.remove('text-slate-300');
  }

  if(viewName === 'favorites') {
    renderFavorites();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  menu.classList.toggle('hidden');
}

document.getElementById('mobile-menu-btn')?.addEventListener('click', toggleMobileMenu);

// Formatação Financeira
function formatCurrency(val) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
}

// Gerenciamento de Favoritos
function toggleFavorite(id, event) {
  if(event) event.stopPropagation();
  
  const index = favorites.indexOf(id);
  if(index === -1) {
    favorites.push(id);
  } else {
    favorites.splice(index, 1);
  }

  localStorage.setItem('imobprime_favorites', JSON.stringify(favorites));
  updateFavoritesBadge();
  
  // Re-renderizar conforme visualização ativa
  renderFeaturedProperties();
  applyFilters();
  if(document.getElementById('view-favorites').classList.contains('active')) {
    renderFavorites();
  }
}

function updateFavoritesBadge() {
  const badges = [document.getElementById('fav-badge'), document.getElementById('fav-badge-mobile')];
  badges.forEach(badge => {
    if(badge) {
      badge.textContent = favorites.length;
      if(favorites.length > 0) {
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }
  });
}

function createPropertyCardHTML(property) {
  const isFav = favorites.includes(property.id);
  const formattedPrice = property.purpose === 'Aluguel' 
    ? `${formatCurrency(property.price)} / mês` 
    : formatCurrency(property.price);

  return `
    <div class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/80 flex flex-col justify-between group">
      <div>
        <div class="relative h-48 overflow-hidden bg-slate-100">
          <img src="${property.image}" alt="${property.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          <span class="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
            ${property.purpose}
          </span>
          <button onclick="toggleFavorite(${property.id}, event)" class="absolute top-3 right-3 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow transition-all text-slate-400 hover:text-rose-500">
            <i class="fa-${isFav ? 'solid text-rose-500' : 'regular'} fa-heart text-base"></i>
          </button>
        </div>

        <div class="p-5">
          <div class="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">${property.type}</div>
          <h3 class="font-bold text-slate-800 text-lg line-clamp-1 group-hover:text-emerald-600 transition-colors">${property.title}</h3>
          <p class="text-slate-500 text-xs mt-1 line-clamp-1 flex items-center">
            <i class="fa-solid fa-location-dot text-slate-400 mr-1.5"></i>
            ${property.address}
          </p>

          <div class="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-slate-600 text-xs font-medium">
            ${property.bedrooms > 0 ? `<div><i class="fa-solid fa-bed text-slate-400 mr-1"></i>${property.bedrooms} qtos</div>` : ''}
            ${property.bathrooms > 0 ? `<div><i class="fa-solid fa-bath text-slate-400 mr-1"></i>${property.bathrooms} ban</div>` : ''}
            <div><i class="fa-solid fa-ruler-combined text-slate-400 mr-1"></i>${property.area} m²</div>
          </div>
        </div>
      </div>

      <div class="p-5 pt-0 flex items-center justify-between border-t border-slate-50 mt-2">
        <div>
          <span class="text-[10px] text-slate-400 block font-medium">Valor</span>
          <span class="text-lg font-extrabold text-slate-900">${formattedPrice}</span>
        </div>
        <button onclick="openModal(${property.id})" class="bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-lg transition-colors">
          Ver Detalhes
        </button>
      </div>
    </div>
  `;
}

function renderFeaturedProperties() {
  const container = document.getElementById('featured-grid');
  if(!container) return;
  const featured = properties.filter(p => p.featured);
  container.innerHTML = featured.map(p => createPropertyCardHTML(p)).join('');
}

function executeHeroSearch() {
  const purpose = document.getElementById('hero-purpose').value;
  const type = document.getElementById('hero-type').value;
  const location = document.getElementById('hero-location').value;

  if(purpose) setPurposeFilter(purpose);
  if(type) document.getElementById('filter-type').value = type;
  if(location) document.getElementById('filter-search').value = location;

  navigateTo('catalog');
  applyFilters();
}

function setPurposeFilter(purpose) {
  currentFilterPurpose = purpose;
  document.querySelectorAll('.filter-purpose-btn').forEach(btn => {
    btn.classList.remove('bg-emerald-600', 'text-white', 'border-emerald-600');
    btn.classList.add('bg-slate-50', 'text-slate-600', 'border-slate-200');
  });

  let activeBtnId = 'btn-purpose-all';
  if(purpose === 'Venda') activeBtnId = 'btn-purpose-venda';
  if(purpose === 'Aluguel') activeBtnId = 'btn-purpose-aluguel';

  const activeBtn = document.getElementById(activeBtnId);
  if(activeBtn) {
    activeBtn.classList.remove('bg-slate-50', 'text-slate-600', 'border-slate-200');
    activeBtn.classList.add('bg-emerald-600', 'text-white', 'border-emerald-600');
  }

  applyFilters();
}

function setBedroomsFilter(count) {
  currentFilterBedrooms = count;
  document.querySelectorAll('.filter-bed-btn').forEach((btn, idx) => {
    if(idx === count) {
      btn.classList.remove('bg-slate-50', 'text-slate-600', 'border-slate-200');
      btn.classList.add('bg-emerald-600', 'text-white', 'border-emerald-600');
    } else {
      btn.classList.remove('bg-emerald-600', 'text-white', 'border-emerald-600');
      btn.classList.add('bg-slate-50', 'text-slate-600', 'border-slate-200');
    }
  });
  applyFilters();
}

function updatePriceDisplay() {
  const priceVal = document.getElementById('filter-price').value;
  document.getElementById('price-limit-display').textContent = `Até ${formatCurrency(priceVal)}`;
}

function resetFilters() {
  document.getElementById('filter-search').value = '';
  document.getElementById('filter-type').value = '';
  document.getElementById('filter-price').value = 5000000;
  updatePriceDisplay();
  setPurposeFilter('');
  setBedroomsFilter(0);
}

function applyFilters() {
  const keyword = document.getElementById('filter-search')?.value.toLowerCase() || '';
  const type = document.getElementById('filter-type')?.value || '';
  const maxPrice = parseFloat(document.getElementById('filter-price')?.value) || 5000000;
  const sortBy = document.getElementById('catalog-sort')?.value || 'recent';

  let filtered = properties.filter(p => {
    const matchesKeyword = p.title.toLowerCase().includes(keyword) || 
                           p.address.toLowerCase().includes(keyword) || 
                           p.description.toLowerCase().includes(keyword);
    const matchesType = type === '' || p.type === type;
    const matchesPurpose = currentFilterPurpose === '' || p.purpose === currentFilterPurpose;
    const matchesPrice = p.price <= maxPrice;
    const matchesBedrooms = p.bedrooms >= currentFilterBedrooms;

    return matchesKeyword && matchesType && matchesPurpose && matchesPrice && matchesBedrooms;
  });

  // Ordenação
  if(sortBy === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if(sortBy === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else {
    filtered.sort((a, b) => b.id - a.id);
  }

  const grid = document.getElementById('catalog-grid');
  const countDisplay = document.getElementById('catalog-count');

  if(countDisplay) {
    countDisplay.textContent = `${filtered.length} imóveis encontrados`;
  }

  if(grid) {
    if(filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
          <i class="fa-solid fa-building-circle-xmark text-4xl text-slate-300 mb-3"></i>
          <p class="font-bold text-slate-700">Nenhum imóvel encontrado</p>
          <p class="text-xs text-slate-400 mt-1">Tente ajustar seus filtros para obter resultados.</p>
        </div>
      `;
    } else {
      grid.innerHTML = filtered.map(p => createPropertyCardHTML(p)).join('');
    }
  }
}

function renderFavorites() {
  const grid = document.getElementById('favorites-grid');
  const emptyState = document.getElementById('favorites-empty');
  const favProperties = properties.filter(p => favorites.includes(p.id));

  if(favProperties.length === 0) {
    grid.innerHTML = '';
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
    grid.innerHTML = favProperties.map(p => createPropertyCardHTML(p)).join('');
  }
}

function calculateFinancing() {
  const propVal = parseFloat(document.getElementById('sim-property-value').value) || 0;
  const downPay = parseFloat(document.getElementById('sim-down-payment').value) || 0;
  const years = parseInt(document.getElementById('sim-years').value) || 1;
  const annualRate = parseFloat(document.getElementById('sim-interest').value) || 0;
  const system = document.getElementById('sim-system').value;

  const financedAmount = Math.max(0, propVal - downPay);
  const months = years * 12;
  const monthlyRate = (annualRate / 100) / 12;

  let firstPayment = 0;
  let lastPayment = 0;
  let totalInterest = 0;

  if(financedAmount > 0 && months > 0) {
    if(system === 'SAC') {
      const amortization = financedAmount / months;
      firstPayment = amortization + (financedAmount * monthlyRate);
      lastPayment = amortization + (amortization * monthlyRate);
      
      // Total juros no SAC
      totalInterest = ((financedAmount * monthlyRate) + (amortization * monthlyRate)) * months / 2;
    } else {
      // PRICE
      if(monthlyRate > 0) {
        firstPayment = financedAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
      } else {
        firstPayment = financedAmount / months;
      }
      lastPayment = firstPayment;
      totalInterest = (firstPayment * months) - financedAmount;
    }
  }

  const totalCost = financedAmount + totalInterest;

  document.getElementById('res-system-title').textContent = system === 'SAC' ? 'Sistema SAC (Decrescente)' : 'Tabela PRICE (Fixa)';
  document.getElementById('res-first-payment').textContent = formatCurrency(firstPayment);
  document.getElementById('res-last-payment').textContent = formatCurrency(lastPayment);
  document.getElementById('res-financed-amount').textContent = formatCurrency(financedAmount);
  document.getElementById('res-total-interest').textContent = formatCurrency(totalInterest);
  document.getElementById('res-total-cost').textContent = formatCurrency(totalCost);
}

function openModal(id) {
  const property = properties.find(p => p.id === id);
  if(!property) return;

  document.getElementById('modal-property-id').value = property.id;
  document.getElementById('modal-image').src = property.image;
  document.getElementById('modal-purpose').textContent = property.purpose;
  document.getElementById('modal-type').textContent = property.type;
  document.getElementById('modal-title').textContent = property.title;
  document.getElementById('modal-address').querySelector('span').textContent = property.address;
  
  const formattedPrice = property.purpose === 'Aluguel' 
    ? `${formatCurrency(property.price)} / mês` 
    : formatCurrency(property.price);
  document.getElementById('modal-price').textContent = formattedPrice;

  document.getElementById('modal-bedrooms').textContent = property.bedrooms > 0 ? `${property.bedrooms} Quartos` : 'N/A';
  document.getElementById('modal-bathrooms').textContent = property.bathrooms > 0 ? `${property.bathrooms} Banheiros` : 'N/A';
  document.getElementById('modal-garage').textContent = property.garage > 0 ? `${property.garage} Vagas` : 'Sem vaga';
  document.getElementById('modal-area').textContent = `${property.area} m²`;
  document.getElementById('modal-description').textContent = property.description;

  // Reseta Form de Contato
  document.getElementById('contact-form').reset();
  document.getElementById('contact-form').classList.remove('hidden');
  document.getElementById('contact-success').classList.add('hidden');

  document.getElementById('property-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('property-modal').classList.add('hidden');
  document.body.style.overflow = 'auto';
}

function handleContactSubmit(e) {
  e.preventDefault();
  
  // Simula envio de contato/proposta
  document.getElementById('contact-form').classList.add('hidden');
  document.getElementById('contact-success').classList.remove('hidden');
}