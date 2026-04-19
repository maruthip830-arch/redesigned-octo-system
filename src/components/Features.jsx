import React from 'react';
import { Settings, Shield, Zap, Clock } from 'lucide-react';
import './Features.css';

const featureData = [
  {
    icon: <Settings className="feature-icon" />,
    title: 'Zero Maintenance',
    description: 'We handle all repairs, upgrades, and regular servicing at no extra cost.'
  },
  {
    icon: <Shield className="feature-icon" />,
    title: 'Premium Devices',
    description: 'Latest generation MacBooks, Dell XPS, and ThinkPads in pristine condition.'
  },
  {
    icon: <Clock className="feature-icon" />,
    title: 'Flexible Tenure',
    description: 'Rent for a month, a year, or longer. Upgrade or downgrade anytime.'
  },
  {
    icon: <Zap className="feature-icon" />,
    title: 'Next-day Delivery',
    description: 'Order today, start working tomorrow. Fast and secure delivery to your door.'
  }
];

const Features = () => {
  return (
    <section id="features" className="features-section">
      <div className="container">
        
        <div className="section-header">
          <h2 className="section-title">Why Choose <span className="text-gradient">AstraRent</span>?</h2>
          <p className="section-subtitle">
            We provide an enterprise-grade experience for startups, freelancers, and growing teams.
          </p>
        </div>

        <div className="features-grid">
          {featureData.map((feature, index) => (
            <div className="feature-card glass-panel" key={index}>
              <div className="icon-wrapper">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;
