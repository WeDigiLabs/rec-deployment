"use client";

import React, { useEffect, useState } from 'react';
import { fetchFromApi } from '../lib/api';

interface ContactInfo {
  socialMedia?: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    email?: string;
    phone?: string;
  };
  contactCategories?: Array<{
    title: string;
    items: Array<{
      label: string;
      email: string;
    }>;
  }>;
  addresses?: Array<{
    title: string;
    address: string;
    phones: Array<{ number: string }>;
    fax?: string;
    email: string;
  }>;
  importantNumbers?: Array<{
    label: string;
    phones: Array<{ number: string }>;
  }>;
  website?: {
    url?: string;
    displayText?: string;
  };
}

interface ContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
}


const contactIcons = [
  {
    name: 'LinkedIn',
    key: 'linkedin',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    bgColor: 'bg-blue-600 hover:bg-blue-700',
  },
  {
    name: 'Facebook',
    key: 'facebook',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    bgColor: 'bg-blue-600 hover:bg-blue-700',
  },
  {
    name: 'Instagram',
    key: 'instagram',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.017 0C8.396 0 7.944.014 6.718.072 5.495.13 4.673.334 3.974.63c-.717.297-1.325.697-1.93 1.302C1.439 2.537 1.04 3.145.743 3.862c-.297.698-.5 1.52-.558 2.743C.128 7.831.114 8.283.114 11.904c0 3.621.014 4.073.072 5.299.058 1.223.262 2.045.558 2.743.297.717.697 1.325 1.302 1.93.605.605 1.213 1.005 1.93 1.302.698.297 1.52.5 2.743.558 1.226.058 1.678.072 5.299.072 3.621 0 4.073-.014 5.299-.072 1.223-.058 2.045-.262 2.743-.558.717-.297 1.325-.697 1.93-1.302.605-.605 1.005-1.213 1.302-1.93.297-.698.5-1.52.558-2.743.058-1.226.072-1.678.072-5.299 0-3.621-.014-4.073-.072-5.299-.058-1.223-.262-2.045-.558-2.743-.297-.717-.697-1.325-1.302-1.93C20.456 1.439 19.848 1.04 19.131.743c-.698-.297-1.52-.5-2.743-.558C15.162.128 14.71.114 11.089.114L12.017 0zm-.056 2.163c3.555 0 3.975.014 5.38.072 1.297.059 2.002.275 2.471.458.621.242 1.065.532 1.531.998.466.466.756.91.998 1.531.183.469.399 1.174.458 2.471.058 1.405.072 1.825.072 5.38 0 3.555-.014 3.975-.072 5.38-.059 1.297-.275 2.002-.458 2.471-.242.621-.532 1.065-.998 1.531-.466.466-.91.756-1.531.998-.469.183-1.174.399-2.471.458-1.405.058-1.825.072-5.38.072-3.555 0-3.975-.014-5.38-.072-1.297-.059-2.002-.275-2.471-.458-.621-.242-1.065-.532-1.531-.998-.466-.466-.756-.91-.998-1.531-.183-.469-.399-1.174-.458-2.471-.058-1.405-.072-1.825-.072-5.38 0-3.555.014-3.975.072-5.38.059-1.297.275-2.002.458-2.471.242-.621.532-1.065.998-1.531.466-.466.91-.756 1.531-.998.469-.183 1.174-.399 2.471-.458 1.405-.058 1.825-.072 5.38-.072l-.001-.001z"/>
        <path d="M12.017 15.33c-1.852 0-3.355-1.503-3.355-3.355 0-1.852 1.503-3.355 3.355-3.355 1.852 0 3.355 1.503 3.355 3.355 0 1.852-1.503 3.355-3.355 3.355zM12.017 6.488c-3.048 0-5.52 2.472-5.52 5.52s2.472 5.52 5.52 5.52 5.52-2.472 5.52-5.52-2.472-5.52-5.52-5.52zM19.846 6.205c0 .712-.577 1.289-1.289 1.289-.712 0-1.289-.577-1.289-1.289 0-.712.577-1.289 1.289-1.289.712 0 1.289.577 1.289 1.289z"/>
      </svg>
    ),
    bgColor: 'bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600',
  },
  {
    name: 'Email',
    key: 'email',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
      </svg>
    ),
    bgColor: 'bg-gray-600 hover:bg-gray-700',
  },
  {
    name: 'Phone',
    key: 'phone',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
      </svg>
    ),
    bgColor: 'bg-green-600 hover:bg-green-700',
  },
];

const ContactDialog: React.FC<ContactDialogProps> = ({ isOpen, onClose }) => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('social');

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);
      fetchFromApi('/api/globals/contact')
        .then((data) => {
          setContactInfo(data);
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to load contact info');
          setLoading(false);
        });
  }, [isOpen]);

  if (!isOpen) return null;

  const tabs = [
    { id: 'social', label: 'Social Media' },
    { id: 'academic', label: 'Academic' },
    { id: 'departments', label: 'Departments' },
    { id: 'addresses', label: 'Addresses' },
    { id: 'phones', label: 'Phone Numbers' },
    { id: 'location', label: 'Location' }
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-transparent bg-opacity-50 z-[999998] transition-opacity"
        onClick={onClose}
        style={{ zIndex: 999998 }}
      />

      {/* Dialog */}
      <div 
        className="fixed inset-0 flex items-center justify-center z-[999999] p-1 sm:p-2 md:p-4 lg:p-6"
        style={{ zIndex: 999999 }}
      >
        <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-1 sm:mx-2 md:mx-4 max-h-[90vh] sm:max-h-[85vh] md:max-h-[80vh] lg:max-h-[75vh] xl:max-h-[70vh] flex flex-col transform transition-all overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-3 sm:p-4 md:p-5 lg:p-6 border-b bg-gray-50 sm:bg-white">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 truncate pr-2">Contact Information</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1 sm:p-2 rounded-full hover:bg-gray-100 flex-shrink-0"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="border-b overflow-x-auto scrollbar-hide bg-gray-50 sm:bg-white flex-shrink-0">
            <nav className="flex space-x-0 min-w-max px-2 sm:px-0 min-h-[48px] sm:min-h-[52px] items-center">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-xs sm:text-sm md:text-base font-medium border-b-2 transition-colors whitespace-nowrap h-[48px] sm:h-[52px] flex items-center justify-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 min-h-0" style={{ WebkitOverflowScrolling: 'touch' }}>
            {loading && (
              <div className="text-center text-gray-500 py-6 sm:py-8 md:py-12 min-h-[150px] sm:min-h-[200px] flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 md:h-12 md:w-12 border-b-2 border-blue-500 mx-auto mb-3 sm:mb-4"></div>
                <p className="text-xs sm:text-sm md:text-base">Loading...</p>
              </div>
            )}
            {error && (
              <div className="text-center text-red-500 py-6 sm:py-8 md:py-12 min-h-[150px] sm:min-h-[200px] flex flex-col items-center justify-center">
                <div className="text-red-500 mb-3 sm:mb-4">
                  <svg className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xs sm:text-sm md:text-base">{error}</p>
              </div>
            )}

            {/* Social Media Tab */}
            {activeTab === 'social' && !loading && !error && contactInfo && (
              <div className="pb-2">
                <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 text-center text-xs sm:text-sm md:text-base">
                  Connect with us through social media platforms
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
                  {contactIcons.map((contact) => {
                    let url = '';
                    if (contact.key === 'email' && contactInfo.socialMedia?.email) {
                      url = `mailto:${contactInfo.socialMedia.email}`;
                    } else if (contact.key === 'phone' && contactInfo.socialMedia?.phone) {
                      url = `tel:${contactInfo.socialMedia.phone}`;
                    } else if (contactInfo.socialMedia?.[contact.key as keyof typeof contactInfo.socialMedia]) {
                      url = contactInfo.socialMedia[contact.key as keyof typeof contactInfo.socialMedia] as string;
                    } else {
                      return null;
                    }
                    return (
                      <a
                        key={contact.name}
                        href={url}
                        target={contact.key === 'email' || contact.key === 'phone' ? undefined : '_blank'}
                        rel={contact.key === 'email' || contact.key === 'phone' ? undefined : 'noopener noreferrer'}
                        className={`${contact.bgColor} text-white p-2 sm:p-3 md:p-4 lg:p-5 rounded-lg sm:rounded-xl flex flex-col items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-lg min-h-[70px] sm:min-h-[80px] md:min-h-[100px]`}
                      >
                        <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10">
                          {React.cloneElement(contact.icon, { 
                            className: "w-full h-full" 
                          })}
                        </div>
                        <span className="mt-1 sm:mt-2 text-xs sm:text-sm font-medium text-center leading-tight">{contact.name}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Academic Tab */}
            {activeTab === 'academic' && contactInfo?.contactCategories && (
              <div className="space-y-4 sm:space-y-6">
                {contactInfo.contactCategories.slice(0, 2).map((category, idx) => (
                  <div key={idx}>
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">{category.title}</h3>
                    <div className="grid gap-2 sm:gap-3">
                      {category.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="bg-gray-50 p-3 sm:p-4 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100">
                          <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center sm:gap-4">
                            <span className="font-medium text-gray-700 text-sm sm:text-base flex-shrink-0">{item.label}</span>
                            <a 
                              href={`mailto:${item.email}`}
                              className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm md:text-base break-all hover:underline transition-colors"
                            >
                              {item.email}
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Departments Tab */}
            {activeTab === 'departments' && contactInfo?.contactCategories && (
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">Department Contacts</h3>
                <div className="grid gap-2 sm:gap-3">
                  {contactInfo.contactCategories.find(cat => cat.title.toLowerCase().includes('department'))?.items.map((item, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 sm:p-4 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100">
                      <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center sm:gap-4">
                        <span className="font-medium text-gray-700 text-sm sm:text-base flex-shrink-0">{item.label}</span>
                        <a 
                          href={`mailto:${item.email}`}
                          className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm md:text-base break-all hover:underline transition-colors"
                        >
                          {item.email}
                        </a>
                      </div>
                    </div>
                  )) || <p className="text-gray-500 text-center py-4">No department contacts available</p>}
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && contactInfo?.addresses && (
              <div className="space-y-4 sm:space-y-6">
                {contactInfo.addresses.map((addr, idx) => (
                  <div key={idx} className="bg-gray-50 p-4 sm:p-5 md:p-6 rounded-lg border border-gray-100">
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">{addr.title}</h3>
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <span className="font-medium text-gray-600 text-sm sm:text-base block mb-1">Address:</span>
                        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{addr.address}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600 text-sm sm:text-base block mb-2">Phone:</span>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {addr.phones.map((phone, phoneIdx) => (
                            <a 
                              key={phoneIdx}
                              href={`tel:${phone.number}`}
                              className="bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm hover:bg-green-200 transition-colors font-medium"
                            >
                              {phone.number}
                            </a>
                          ))}
                        </div>
                      </div>
                      {addr.fax && (
                        <div>
                          <span className="font-medium text-gray-600 text-sm sm:text-base block mb-1">Fax:</span>
                          <p className="text-gray-700 text-sm sm:text-base">{addr.fax}</p>
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-gray-600 text-sm sm:text-base">Email:</span>
                        <a 
                          href={`mailto:${addr.email}`}
                          className="text-blue-600 hover:text-blue-800 ml-2 text-sm sm:text-base hover:underline transition-colors break-all"
                        >
                          {addr.email}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
                  <p className="text-gray-700 text-sm sm:text-base">
                    <span className="font-medium">Website:</span>
                    <a 
                      href={contactInfo.website?.url || "https://www.rajalakshmi.org"} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:text-blue-800 ml-2 hover:underline transition-colors break-all"
                    >
                      {contactInfo.website?.displayText || "www.rajalakshmi.org"}
                    </a>
                  </p>
                </div>
              </div>
            )}

            {/* Phone Numbers Tab */}
            {activeTab === 'phones' && contactInfo?.importantNumbers && (
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">Important Contact Numbers</h3>
                {contactInfo.importantNumbers.map((contact, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-100">
                    <h4 className="font-medium text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base">{contact.label}</h4>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {contact.phones.map((phone, phoneIdx) => (
                        <a 
                          key={phoneIdx}
                          href={`tel:${phone.number}`}
                          className="bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm hover:bg-green-200 transition-colors font-medium inline-block"
                        >
                          {phone.number}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Location Tab */}
            {activeTab === 'location' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="text-center mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-gray-800">Our Location</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Rajalakshmi Engineering College, Thandalam, Chennai</p>
                </div>
                
                <div className="relative w-full">
                  <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg border border-gray-200">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.4982165589844!2d80.00089456404756!3d13.008533387236878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a528c9ebac84723%3A0x18e2bf88dfefa3ed!2sRajalakshmi%20Engineering%20College!5e0!3m2!1sen!2sin!4v1723380000000!5m2!1sen!2sin"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Rajalakshmi Engineering College Location"
                      className="w-full h-full"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      Address
                    </h4>
                    <p className="text-gray-700 text-sm sm:text-base">
                      Rajalakshmi Engineering College<br />
                      Rajalakshmi Nagar, Thandalam<br />
                      Chennai - 602 105<br />
                      Tamil Nadu, India
                    </p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      Quick Actions
                    </h4>
                    <div className="space-y-2">
                      <a
                        href="https://www.google.com/maps/place/Rajalakshmi+Engineering+College/@13.0085334,80.0008946,930m/data=!3m1!1e3!4m7!3m6!1s0x3a528c9ebac84723:0x18e2bf88dfefa3ed!8m2!3d13.0085334!4d80.0034695!10e1!16s%2Fm%2F0cn_c1y?entry=ttu&g_ep=EgoyMDI1MDgwNi4wIKXMDSoASAFQAw%3D%3D"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Open in Google Maps
                      </a>
                      <a
                        href="https://www.google.com/maps/dir/?api=1&destination=13.0085334,80.0034695"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-green-600 text-white text-center py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        Get Directions
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactDialog;
