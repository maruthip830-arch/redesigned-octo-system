import React, { useState } from 'react';
import { ShoppingCart, X, Cpu, HardDrive, Monitor, Battery, Usb, Command, Scale } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Products.css';

const categories = [
  "All",
  "Workstations",
  "2-in-1 Convertibles",
  "Ultrabooks",
  "Traditional Notebooks",
  "Gaming Laptops"
];

const laptops = [
  // Workstations
  {
    id: 1,
    name: 'MacBook Pro 16" M3 Max',
    brand: 'Apple',
    category: 'Workstations',
    price: '₹9,999',
    specs: ['Apple M3 Max', '36GB Unified RAM', '1TB SSD', '16.2" Liquid Retina XDR'],
    details: { processor: 'Apple M3 Max (14-core CPU, 30-core GPU)', memory: '36GB Unified Memory', storage: '1TB NVMe PCIe Gen4 SSD', display: '16.2-inch Liquid Retina XDR, ProMotion 120Hz', battery: '100Wh, Up to 22 hrs playback', ports: '3x Thunderbolt 4, HDMI, SDXC, MagSafe 3', os: 'macOS Sonoma', weight: '2.14 kg' },
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop',
    popular: true,
  },
  {
    id: 2,
    name: 'Dell Precision 5570',
    brand: 'Dell',
    category: 'Workstations',
    price: '₹7,499',
    specs: ['Intel Core i9 12th Gen', '32GB DDR5', '1TB NVMe', '15.6" UHD+'],
    details: { processor: 'Intel Core i9-12900H vPro', memory: '32GB DDR5 4800MHz', storage: '1TB PCIe Gen4 NVMe', display: '15.6" UHD+ (3840x2400) InfinityEdge Touch', battery: '86Whr, ExpressCharge Capable', ports: '2x Thunderbolt 4, 1x USB-C 3.2, SD Reader', os: 'Windows 11 Pro', weight: '1.84 kg' },
    image: '/dell_precision.png',
    popular: false,
  },
  {
    id: 11,
    name: 'Lenovo ThinkPad P16',
    brand: 'Lenovo',
    category: 'Workstations',
    price: '₹7,999',
    specs: ['Intel Core i9 HX', '64GB ECC RAM', '2TB SSD', '16" 4K OLED Touch'],
    details: { processor: 'Intel Core i9-13980HX', memory: '64GB DDR5 ECC RAM', storage: '2TB PCIe Gen4 Performance SSD', display: '16.0" 4K OLED (3840x2400) Dolby Vision', battery: '94Whr Massive Capacity', ports: '2x Thunderbolt 4, 2x USB-A 3.2, HDMI 2.1', os: 'Windows 11 Pro for Workstations', weight: '2.95 kg' },
    image: '/lenovo_p16.png',
    popular: false,
  },
  {
    id: 12,
    name: 'HP ZBook Fury 16',
    brand: 'HP',
    category: 'Workstations',
    price: '₹6,899',
    specs: ['Intel Core i7 13th Gen', '32GB RAM', '1TB NVMe', 'RTX 3500 Ada'],
    details: { processor: 'Intel Core i7-13700HX', memory: '32GB DDR5 5600MHz', storage: '1TB PCIe Gen4 NVMe TLC', display: '16" WUXGA (1920x1200) 120Hz IPS', battery: '95Whr HP Long Life', ports: '2x Thunderbolt 4, 2x USB-A, Mini DisplayPort', os: 'Windows 11 Pro', weight: '2.4 kg' },
    image: '/hp_zbook.png',
    popular: false,
  },
  {
    id: 13,
    name: 'MSI CreatorPro Z17',
    brand: 'MSI',
    category: 'Workstations',
    price: '₹8,999',
    specs: ['Intel Core i9 13th Gen', '64GB RAM', '2TB SSD', '17" QHD+ 165Hz'],
    details: { processor: 'Intel Core i9-13950HX', memory: '64GB DDR5 5600MHz', storage: '2TB PCIe Gen5 NVMe', display: '17" QHD+ (2560x1600) 165Hz Touch', battery: '90Whr Li-Polymer', ports: '2x Thunderbolt 4, 1x USB-A, HDMI 2.1, SD Card', os: 'Windows 11 Pro', weight: '2.49 kg' },
    image: '/msi_creator.png',
    popular: true,
  },
  // 2-in-1 Convertibles
  {
    id: 3,
    name: 'Samsung Galaxy Book3 Pro 360',
    brand: 'Samsung',
    category: '2-in-1 Convertibles',
    price: '₹5,499',
    specs: ['Intel Core i7 13th Gen', '16GB RAM', '512GB SSD', '16" AMOLED Touch'],
    details: { processor: 'Intel Core i7-1360P', memory: '16GB LPDDR5', storage: '512GB NVMe SSD', display: '16" Dynamic AMOLED 2X Touch', battery: '76Whr, 65W Fast Charging', ports: '2x Thunderbolt 4, 1x USB-A, microSD', os: 'Windows 11 Home', weight: '1.66 kg' },
    image: 'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?q=80&w=1000&auto=format&fit=crop',
    popular: true,
  },
  {
    id: 4,
    name: 'HP Spectre x360 14',
    brand: 'HP',
    category: '2-in-1 Convertibles',
    price: '₹4,999',
    specs: ['Intel Core i7 12th Gen', '16GB RAM', '1TB SSD', '13.5" OLED Touch'],
    details: { processor: 'Intel Core i7-1255U', memory: '16GB LPDDR4x', storage: '1TB PCIe NVMe TLC', display: '13.5" OLED (3000x2000) Touch Anti-Reflection', battery: '66Whr, up to 13.5 hours', ports: '2x Thunderbolt 4, 1x USB-A, Audio Combo', os: 'Windows 11 Home', weight: '1.36 kg' },
    image: '/hp_spectre.png',
    popular: false,
  },
  {
    id: 14,
    name: 'Lenovo Yoga 9i',
    brand: 'Lenovo',
    category: '2-in-1 Convertibles',
    price: '₹5,299',
    specs: ['Intel Core i7 13th Gen', '16GB RAM', '1TB SSD', '14" 4K OLED Touch'],
    details: { processor: 'Intel Core i7-1360P', memory: '16GB LPDDR5 5200MHz', storage: '1TB M.2 PCIe Gen4', display: '14" 4K OLED (3840x2400) Dolby Vision Touch', battery: '75Whr, Rapid Charge Boost', ports: '2x Thunderbolt 4, 1x USB-A 3.2, 1x USB-C 3.2', os: 'Windows 11 Home', weight: '1.4 kg' },
    image: '/lenovo_yoga.png',
    popular: true,
  },
  {
    id: 15,
    name: 'ASUS ROG Flow X13',
    brand: 'ASUS',
    category: '2-in-1 Convertibles',
    price: '₹6,499',
    specs: ['AMD Ryzen 9', '32GB RAM', '1TB SSD', 'RTX 4060 8GB'],
    details: { processor: 'AMD Ryzen 9 7940HS', memory: '32GB LPDDR5', storage: '1TB PCIe Gen4 NVMe', display: '13.4" QHD+ 165Hz Touchscreen', battery: '75Whr', ports: 'XG Mobile Interface, 2x USB-C 3.2, 1x USB-A', os: 'Windows 11 Pro', weight: '1.30 kg' },
    image: '/asus_flow.png',
    popular: false,
  },
  {
    id: 16,
    name: 'Microsoft Surface Pro 9',
    brand: 'Microsoft',
    category: '2-in-1 Convertibles',
    price: '₹4,799',
    specs: ['Intel Core i7 12th Gen', '16GB RAM', '512GB SSD', '13" PixelSense Flow'],
    details: { processor: 'Intel Core i7-1255U', memory: '16GB LPDDR5', storage: '512GB Removable SSD', display: '13" PixelSense Flow (2880x1920) 120Hz Touch', battery: '47.7Whr, up to 15.5 hours', ports: '2x Thunderbolt 4, Surface Connect', os: 'Windows 11 Home', weight: '0.88 kg' },
    image: '/surface_pro.png',
    popular: true,
  },
  // Ultrabooks
  {
    id: 5,
    name: 'MacBook Air 15" M3',
    brand: 'Apple',
    category: 'Ultrabooks',
    price: '₹4,499',
    specs: ['Apple M3', '16GB Unified RAM', '512GB SSD', '15.3" Liquid Retina'],
    details: { processor: 'Apple M3 (8-core CPU, 10-core GPU)', memory: '16GB Unified Memory', storage: '512GB PCIe SSD', display: '15.3-inch Liquid Retina Display', battery: '66.5Whr, up to 18 hrs playback', ports: '2x Thunderbolt / USB 4, MagSafe 3', os: 'macOS Sonoma', weight: '1.51 kg' },
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1000&auto=format&fit=crop',
    popular: true,
  },
  {
    id: 6,
    name: 'LG Gram 17',
    brand: 'LG',
    category: 'Ultrabooks',
    price: '₹4,299',
    specs: ['Intel Core i7 13th Gen', '16GB RAM', '1TB SSD', '17" WQXGA IPS'],
    details: { processor: 'Intel Core i7-1360P', memory: '16GB LPDDR5 6000MHz', storage: '1TB NVMe Gen4 M.2 SSD', display: '17" WQXGA (2560x1600) IPS Non-Reflective', battery: '80Whr High-Density', ports: '2x Thunderbolt 4, 2x USB-A 3.2, HDMI', os: 'Windows 11 Home', weight: '1.35 kg' },
    image: '/lg_gram.png',
    popular: false,
  },
  {
    id: 17,
    name: 'Dell XPS 13 Plus',
    brand: 'Dell',
    category: 'Ultrabooks',
    price: '₹4,899',
    specs: ['Intel Core i7 13th Gen', '16GB RAM', '512GB SSD', '13.4" OLED Touch'],
    details: { processor: 'Intel Core i7-1360P', memory: '16GB LPDDR5 6000MHz', storage: '512GB PCIe Gen4 NVMe', display: '13.4" 3.5K OLED Touch InfinityEdge', battery: '55Whr, ExpressCharge', ports: '2x Thunderbolt 4 (USB-C)', os: 'Windows 11 Pro', weight: '1.26 kg' },
    image: '/dell_xps.png',
    popular: true,
  },
  {
    id: 18,
    name: 'ASUS Zenbook 14 OLED',
    brand: 'ASUS',
    category: 'Ultrabooks',
    price: '₹3,999',
    specs: ['AMD Ryzen 7', '16GB RAM', '512GB SSD', '14" 2.8K OLED'],
    details: { processor: 'AMD Ryzen 7 7730U', memory: '16GB LPDDR4X', storage: '512GB PCIe Gen3 NVMe', display: '14" 2.8K (2880x1800) OLED 90Hz', battery: '75Whr Li-ion', ports: '2x USB-C 3.2, 1x USB-A 3.2, HDMI 2.1', os: 'Windows 11 Home', weight: '1.39 kg' },
    image: '/asus_zenbook.png',
    popular: false,
  },
  {
    id: 19,
    name: 'Framework Laptop 13',
    brand: 'Framework',
    category: 'Ultrabooks',
    price: '₹4,299',
    specs: ['Intel Core i7 13th Gen', '32GB RAM', '1TB SSD', '13.5" 3:2 Display'],
    details: { processor: 'Intel Core i7-1370P', memory: '32GB DDR4 3200MHz', storage: '1TB WD_BLACK SN850X NVMe', display: '13.5" 3:2 (2256x1504) 100% sRGB', battery: '55Whr', ports: '4x Customizable Expansion Cards', os: 'Windows 11 Pro', weight: '1.30 kg' },
    image: '/framework_laptop.png',
    popular: false,
  },
  {
    id: 20,
    name: 'Microsoft Surface Laptop 5',
    brand: 'Microsoft',
    category: 'Ultrabooks',
    price: '₹4,499',
    specs: ['Intel Core i7 12th Gen', '16GB RAM', '512GB SSD', '15" PixelSense'],
    details: { processor: 'Intel Core i7-1265U', memory: '16GB LPDDR5x', storage: '512GB Removable SSD', display: '15" PixelSense (2496x1664) Touch', battery: '47.4Whr', ports: '1x Thunderbolt 4, 1x USB-A, Surface Connect', os: 'Windows 11 Home', weight: '1.56 kg' },
    image: '/surface_laptop.png',
    popular: false,
  },
  // Traditional Notebooks
  {
    id: 7,
    name: 'Acer Aspire 5',
    brand: 'Acer',
    category: 'Traditional Notebooks',
    price: '₹1,999',
    specs: ['Intel Core i5 12th Gen', '8GB RAM', '512GB SSD', '15.6" FHD IPS'],
    details: { processor: 'Intel Core i5-1235U', memory: '8GB DDR4', storage: '512GB PCIe Gen3 NVMe', display: '15.6" FHD (1920x1080) ComfyView IPS', battery: '50Whr Li-ion', ports: '3x USB-A 3.2, 1x Thunderbolt 4, HDMI 2.1, RJ45', os: 'Windows 11 Home', weight: '1.76 kg' },
    image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1000&auto=format&fit=crop',
    popular: false,
  },
  {
    id: 8,
    name: 'Dell Inspiron 15',
    brand: 'Dell',
    category: 'Traditional Notebooks',
    price: '₹1,799',
    specs: ['Intel Core i3 11th Gen', '8GB RAM', '256GB NVMe', '15.6" FHD'],
    details: { processor: 'Intel Core i3-1115G4', memory: '8GB DDR4 2666MHz', storage: '256GB M.2 PCIe NVMe SSD', display: '15.6" FHD (1920x1080) Anti-glare', battery: '41Whr 3-Cell Battery', ports: '2x USB-A 3.2, 1x USB-A 2.0, HDMI 1.4', os: 'Windows 11 Home in S Mode', weight: '1.85 kg' },
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1000&auto=format&fit=crop',
    popular: false,
  },
  {
    id: 21,
    name: 'Lenovo IdeaPad 5',
    brand: 'Lenovo',
    category: 'Traditional Notebooks',
    price: '₹1,599',
    specs: ['AMD Ryzen 5', '8GB RAM', '512GB SSD', '15.6" FHD'],
    details: { processor: 'AMD Ryzen 5 5500U', memory: '8GB DDR4 3200MHz', storage: '512GB PCIe NVMe SSD', display: '15.6" FHD (1920x1080) IPS 300nits', battery: '57Whr, Rapid Charge', ports: '2x USB-A 3.2, 1x USB-C 3.2 Gen 1, HDMI 1.4b, SD Reader', os: 'Windows 11 Home', weight: '1.66 kg' },
    image: 'https://images.unsplash.com/photo-1542393545-10f5cde2c810?q=80&w=1000&auto=format&fit=crop',
    popular: false,
  },
  {
    id: 22,
    name: 'HP Pavilion 15',
    brand: 'HP',
    category: 'Traditional Notebooks',
    price: '₹1,699',
    specs: ['Intel Core i5 12th Gen', '16GB RAM', '512GB SSD', '15.6" FHD IPS'],
    details: { processor: 'Intel Core i5-1240P', memory: '16GB DDR4 3200MHz', storage: '512GB PCIe NVMe SSD', display: '15.6" FHD (1920x1080) IPS Micro-edge', battery: '41Whr Li-ion', ports: '1x USB-C 3.2, 2x USB-A 3.2, HDMI 2.1', os: 'Windows 11 Home', weight: '1.74 kg' },
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1000&auto=format&fit=crop',
    popular: false,
  },
  {
    id: 23,
    name: 'Acer Swift 3',
    brand: 'Acer',
    category: 'Traditional Notebooks',
    price: '₹1,899',
    specs: ['AMD Ryzen 7', '16GB RAM', '512GB SSD', '14" FHD IPS'],
    details: { processor: 'AMD Ryzen 7 5700U', memory: '16GB LPDDR4X', storage: '512GB PCIe Gen3 NVMe', display: '14" FHD (1920x1080) IPS 100% sRGB', battery: '48Whr Li-ion', ports: '1x USB-C 3.2 Gen 2, 2x USB-A 3.2, HDMI 2.0', os: 'Windows 11 Home', weight: '1.19 kg' },
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop',
    popular: false,
  },
  // Gaming Laptops
  {
    id: 9,
    name: 'ASUS ROG Zephyrus G14',
    brand: 'ASUS',
    category: 'Gaming Laptops',
    price: '₹6,999',
    specs: ['AMD Ryzen 9', '32GB RAM', '1TB NVMe', 'RTX 4060 8GB'],
    details: { processor: 'AMD Ryzen 9 7940HS', memory: '32GB DDR5 4800MHz', storage: '1TB PCIe Gen4 Performance SSD', display: '14" ROG Nebula Display QHD 165Hz', battery: '76Whr, 100W PD Charging', ports: '2x USB-C 3.2 (DP/Power), 2x USB-A 3.2, HDMI 2.1', os: 'Windows 11 Home', weight: '1.65 kg' },
    image: '/asus_rog.png',
    popular: true,
  },
  {
    id: 10,
    name: 'Razer Blade 15',
    brand: 'Razer',
    category: 'Gaming Laptops',
    price: '₹8,499',
    specs: ['Intel Core i7 13th Gen', '16GB RAM', '1TB SSD', 'RTX 4070 8GB'],
    details: { processor: 'Intel Core i7-13800H', memory: '16GB DDR5 5200MHz', storage: '1TB PCIe Gen4 NVMe M.2', display: '15.6" QHD 240Hz Advanced Optimus', battery: '80Whr Polymer', ports: '2x Thunderbolt 4, 3x USB-A 3.2, HDMI 2.1, SD Reader', os: 'Windows 11 Home', weight: '2.01 kg' },
    image: '/razer_blade.png',
    popular: false,
  },
  {
    id: 24,
    name: 'Lenovo Legion Pro 7i',
    brand: 'Lenovo',
    category: 'Gaming Laptops',
    price: '₹7,899',
    specs: ['Intel Core i9 13th Gen', '32GB RAM', '1TB SSD', 'RTX 4080 12GB'],
    details: { processor: 'Intel Core i9-13900HX', memory: '32GB DDR5 5600MHz Overclocked', storage: '1TB PCIe Gen4 NVMe TLC', display: '16" WQXGA (2560x1600) IPS 240Hz 500nits', battery: '99.9Whr Massive Capacity', ports: '1x Thunderbolt 4, 1x USB-C 3.2, 4x USB-A 3.2, HDMI 2.1, RJ45', os: 'Windows 11 Pro', weight: '2.80 kg' },
    image: 'https://p2-ofp.static.pub//fes/cms/2025/06/16/oen7uksq2rtvyeg39xsy4aodwk3fb4296605.png',
    popular: true,
  },
  {
    id: 25,
    name: 'MSI Raider GE78',
    brand: 'MSI',
    category: 'Gaming Laptops',
    price: '₹8,999',
    specs: ['Intel Core i9 13th Gen', '64GB RAM', '2TB SSD', 'RTX 4090 16GB'],
    details: { processor: 'Intel Core i9-13980HX', memory: '64GB DDR5 5600MHz', storage: '2TB PCIe Gen5 NVMe M.2', display: '17" QHD+ (2560x1600) 240Hz IPS-Level', battery: '99.9Whr 4-Cell Li-Polymer', ports: '1x Thunderbolt 4, 2x USB-C 3.2, 2x USB-A 3.2, HDMI 2.1, RJ45 2.5GbE', os: 'Windows 11 Home', weight: '3.10 kg' },
    image: 'https://m.media-amazon.com/images/I/71ZBYV+au1L.jpg',
    popular: false,
  }
];

const Products = () => {
  const { addToCart } = useCart();
  const [filters, setFilters] = useState({
    category: 'All',
    brand: 'All',
    maxPrice: 10000,
    minRam: 0
  });

  const [selectedLaptop, setSelectedLaptop] = useState(null);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredLaptops = laptops.filter(laptop => {
    // 1. Category Match
    if (filters.category !== 'All' && laptop.category !== filters.category) return false;
    
    // 2. Brand Match
    if (filters.brand !== 'All' && laptop.brand !== filters.brand) return false;
    
    // 3. Price Match
    const numericPrice = parseInt(laptop.price.replace(/,/g, '').replace('₹', ''));
    if (numericPrice > filters.maxPrice) return false;
    
    // 4. Memory (RAM) Extraction & Match
    if (filters.minRam > 0) {
      const ramSpec = laptop.specs.find(s => s.toLowerCase().includes('ram') || s.toLowerCase().includes('memory')) || laptop.details.memory;
      const ramMatch = ramSpec.match(/(\d+)\s*(gb|tb)/i);
      if (ramMatch) {
         let ramAmount = parseInt(ramMatch[1]);
         if (ramMatch[2].toLowerCase() === 'tb') ramAmount *= 1024;
         if (ramAmount < filters.minRam) return false;
      }
    }
    
    return true;
  });

  const uniqueBrands = Array.from(new Set(laptops.map(l => l.brand))).sort();

  return (
    <section id="fleet" className="products-section">
      <div className="container">
        
        <div className="section-header">
          <h2 className="section-title">Explore Our <span className="text-gradient">Premium Fleet</span></h2>
          <p className="section-subtitle">
            Curated top-of-the-line devices ranging from Apple MacBooks to ASUS Gaming powerhouses.
          </p>
        </div>

        <div className="products-layout">
          
          {/* Advanced Filtering Sidebar */}
          <aside className="products-sidebar glass-panel animation-fade">
            <h3 style={{marginBottom: '1.5rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              Filter Fleet
            </h3>
            
            <div className="filter-group">
              <label>Category</label>
              <select 
                className="input-field" 
                value={filters.category} 
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="filter-group">
              <label>Manufacturer</label>
              <select 
                className="input-field" 
                value={filters.brand} 
                onChange={(e) => handleFilterChange('brand', e.target.value)}
              >
                <option value="All">All Brands</option>
                {uniqueBrands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div className="filter-group">
              <label style={{display: 'flex', justifyContent: 'space-between'}}>
                Max Budget <span>₹{filters.maxPrice.toLocaleString('en-IN')}</span>
              </label>
              <input 
                type="range" 
                min="1000" 
                max="12000" 
                step="500" 
                value={filters.maxPrice} 
                onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
                className="range-slider"
                style={{width: '100%', marginTop: '0.5rem'}}
              />
            </div>

            <div className="filter-group">
              <label>System Memory (RAM)</label>
              <select 
                className="input-field" 
                value={filters.minRam} 
                onChange={(e) => handleFilterChange('minRam', parseInt(e.target.value))}
              >
                <option value={0}>Any Size</option>
                <option value={8}>8GB Minimum</option>
                <option value={16}>16GB Minimum</option>
                <option value={32}>32GB Minimum</option>
                <option value={64}>64GB Minimum</option>
              </select>
            </div>
            
            <button 
              className="btn btn-outline" 
              style={{width: '100%', marginTop: '1rem'}}
              onClick={() => setFilters({category: 'All', brand: 'All', maxPrice: 10000, minRam: 0})}
            >
              Reset Filters
            </button>
          </aside>

          {/* Core Grid */}
          <div className="products-main-grid">
            <div className="results-count">
              Showing {filteredLaptops.length} device{filteredLaptops.length !== 1 ? 's' : ''} matching your criteria
            </div>
            
            <div className="products-grid">
              {filteredLaptops.length > 0 ? (
                filteredLaptops.map(laptop => (
                  <div 
                    key={laptop.id} 
                    className="product-card glass-panel animation-fade cursor-pointer"
                    onClick={() => setSelectedLaptop(laptop)}
                  >
                    {laptop.popular && (
                      <div className="product-badge">Top Choice</div>
                    )}
                    
                    <div className="product-image-container">
                      <img src={laptop.image} alt={laptop.name} className="product-img" />
                    </div>
                    
                    <div className="product-info">
                      <div className="product-head">
                        <span className="product-category">{laptop.brand} • {laptop.category}</span>
                        <h3 className="product-name">{laptop.name}</h3>
                      </div>
                      
                      <ul className="product-specs">
                        {laptop.specs.map((spec, i) => (
                          <li key={i}>{spec}</li>
                        ))}
                      </ul>
                      
                      <div className="product-footer">
                        <div className="product-price">
                          <span className="price-amount">{laptop.price}</span>
                          <span className="price-period">/mo</span>
                        </div>
                        <button className="btn btn-primary rent-btn" onClick={(e) => { e.stopPropagation(); addToCart(laptop); }}>
                          <ShoppingCart size={18} /> Rent
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-products-msg glass-panel">
                  <Monitor size={48} className="text-secondary" style={{marginBottom: '1rem'}} />
                  <h3>No hardware matched your criteria.</h3>
                  <p>Try broadening your filters or increasing your maximum budget.</p>
                  <button className="btn btn-primary mt-3" onClick={() => setFilters({category: 'All', brand: 'All', maxPrice: 10000, minRam: 0})}>Clear All Filters</button>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Product Details Modal */}
      {selectedLaptop && (
        <div className="modal-overlay" onClick={() => setSelectedLaptop(null)}>
          <div className="modal-content glass-panel product-modal animation-fade" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedLaptop(null)} aria-label="Close modal">
              <X size={24} />
            </button>
            <div className="product-modal-grid">
              <div className="product-modal-image">
                <img src={selectedLaptop.image} alt={selectedLaptop.name} />
              </div>
              <div className="product-modal-details">
                <span className="product-category">{selectedLaptop.brand} • {selectedLaptop.category}</span>
                <h2 style={{fontSize: '1.8rem', marginTop: '0.5rem', marginBottom: '0.5rem'}}>{selectedLaptop.name}</h2>
                
                <div className="product-price large">
                  <span className="price-amount">{selectedLaptop.price}</span>
                  <span className="price-period">/month</span>
                </div>
                
                <div className="specs-section">
                  <h3>Extended Specifications</h3>
                  <div className="specs-grid">
                    <div className="spec-box"><Cpu size={20}/> <span>{selectedLaptop.details.processor}</span></div>
                    <div className="spec-box"><HardDrive size={20}/> <span>{selectedLaptop.details.memory}</span></div>
                    <div className="spec-box"><HardDrive size={20}/> <span>{selectedLaptop.details.storage}</span></div>
                    <div className="spec-box"><Monitor size={20}/> <span>{selectedLaptop.details.display}</span></div>
                    <div className="spec-box"><Battery size={20}/> <span>{selectedLaptop.details.battery}</span></div>
                    <div className="spec-box"><Usb size={20}/> <span>{selectedLaptop.details.ports}</span></div>
                    <div className="spec-box"><Command size={20}/> <span>{selectedLaptop.details.os}</span></div>
                    <div className="spec-box"><Scale size={20}/> <span>{selectedLaptop.details.weight}</span></div>
                  </div>
                </div>
                
                <button className="btn btn-primary w-100 mt-4" onClick={(e) => { e.stopPropagation(); addToCart(selectedLaptop); setSelectedLaptop(null); }}>
                  <ShoppingCart size={18}/> Proceed to Rent
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Products;
