import React from 'react';
import { MousePointerClick, CheckCircle, Truck, PackageCheck } from 'lucide-react';
import './Process.css';

const steps = [
  {
    icon: <MousePointerClick size={28} />,
    title: 'Choose Device',
    desc: 'Browse our premium fleet and select the laptop that fits your computing needs.'
  },
  {
    icon: <CheckCircle size={28} />,
    title: 'Instant KYC',
    desc: 'Complete a quick 2-minute digital verification process online.'
  },
  {
    icon: <Truck size={28} />,
    title: 'Fast Delivery',
    desc: 'Receive your sanitized, fully-configured laptop at your doorstep within 24 hours.'
  },
  {
    icon: <PackageCheck size={28} />,
    title: 'Return or Upgrade',
    desc: 'At the end of your tenure, easily return the device or upgrade to a newer model.'
  }
];

const Process = () => {
  return (
    <section id="process" className="process-section">
      <div className="container">
        
        <div className="section-header">
          <h2 className="section-title">How It <span className="text-gradient">Works</span></h2>
          <p className="section-subtitle">
            A seamless, paperless process designed for modern professionals.
          </p>
        </div>

        <div className="process-timeline">
          {steps.map((step, index) => (
            <div className="process-step" key={index}>
              <div className="step-number">{index + 1}</div>
              <div className="step-icon-wrapper">
                {step.icon}
              </div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Process;
