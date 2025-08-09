"use client";

import { Button, NavBar, Testimonials, VerticalListing, BlogCard, TimetableComponent, Breadcrumb } from '../../components';
import ImageFrameRect from '../../components/ImageFrameRect';
import { 
  GraduationCap, 
  User, 
  Star, 
  ClipboardCheck, 
  FileText, 
  Medal
} from 'lucide-react';

export default function ComponentShowcase() {
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 font-[family-name:var(--font-montserrat)]">
      <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
        
        {/* Header */}
        <header className="text-center py-6 sm:py-8">
          <div className="mb-4">
            <Breadcrumb 
              items={[
                { label: "Home", href: "/" },
                { label: "Component Showcase", isCurrentPage: true }
              ]}
              className="justify-center"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">Typography & Color Showcase</h1>
          <p className="text-base sm:text-lg text-foreground/80 px-4 sm:px-0">Montserrat Font Family with Custom Color Scheme & Component Library</p>
        </header>

        {/* Typography Section */}
        <section className="space-y-6 sm:space-y-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground border-b-2 border-foreground/20 pb-2">Typography Hierarchy</h2>
          
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-2">Heading 1 - 5xl Bold</h1>
              <p className="text-sm text-foreground/60">font-bold text-5xl</p>
            </div>
            
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground mb-2">Heading 2 - 4xl Semibold</h2>
              <p className="text-sm text-foreground/60">font-semibold text-4xl</p>
            </div>
            
            <div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-medium text-foreground mb-2">Heading 3 - 3xl Medium</h3>
              <p className="text-sm text-foreground/60">font-medium text-3xl</p>
            </div>
            
            <div>
              <h4 className="text-lg sm:text-xl lg:text-2xl font-medium text-foreground mb-2">Heading 4 - 2xl Medium</h4>
              <p className="text-sm text-foreground/60">font-medium text-2xl</p>
            </div>
            
            <div>
              <h5 className="text-xl font-medium text-foreground mb-2">Heading 5 - xl Medium</h5>
              <p className="text-sm text-foreground/60">font-medium text-xl</p>
            </div>
            
            <div>
              <h6 className="text-lg font-medium text-foreground mb-2">Heading 6 - lg Medium</h6>
              <p className="text-sm text-foreground/60">font-medium text-lg</p>
            </div>
          </div>
        </section>

        {/* Body Text Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-foreground border-b-2 border-foreground/20 pb-2">Body Text Styles</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-lg font-normal text-foreground mb-1">Large Body Text - Regular</p>
              <p className="text-sm text-foreground/60">font-normal text-lg</p>
            </div>
            
            <div>
              <p className="text-base font-normal text-foreground mb-1">Body Text - Regular (Default)</p>
              <p className="text-sm text-foreground/60">font-normal text-base</p>
            </div>
            
            <div>
              <p className="text-sm font-normal text-foreground mb-1">Small Text - Regular</p>
              <p className="text-xs text-foreground/60">font-normal text-sm</p>
            </div>
            
            <div>
              <p className="text-xs font-normal text-foreground mb-1">Extra Small Text</p>
              <p className="text-xs text-foreground/60">font-normal text-xs</p>
            </div>
          </div>
        </section>

        {/* Font Weight Variations */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-foreground border-b-2 border-foreground/20 pb-2">Font Weight Variations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="text-xl font-thin text-foreground">Thin (100) - Montserrat</p>
              <p className="text-xl font-extralight text-foreground">Extra Light (200)</p>
              <p className="text-xl font-light text-foreground">Light (300)</p>
              <p className="text-xl font-normal text-foreground">Normal (400)</p>
            </div>
            <div className="space-y-3">
              <p className="text-xl font-medium text-foreground">Medium (500)</p>
              <p className="text-xl font-semibold text-foreground">Semibold (600)</p>
              <p className="text-xl font-bold text-foreground">Bold (700)</p>
              <p className="text-xl font-extrabold text-foreground">Extra Bold (800)</p>
            </div>
          </div>
        </section>

        {/* Color Scheme Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-foreground border-b-2 border-foreground/20 pb-2">Color Scheme</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Primary Colors</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-background border-2 border-foreground/20 rounded"></div>
                  <div>
                    <p className="font-medium text-foreground">Background</p>
                    <p className="text-sm text-foreground/60">#E7E7E7</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-foreground rounded"></div>
                  <div>
                    <p className="font-medium text-foreground">Foreground</p>
                    <p className="text-sm text-foreground/60">#171717</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Opacity Variations</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-foreground opacity-100 rounded"></div>
                  <div>
                    <p className="font-medium text-foreground">100% Opacity</p>
                    <p className="text-sm text-foreground/60">Full intensity</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-foreground opacity-80 rounded"></div>
                  <div>
                    <p className="font-medium text-foreground/80">80% Opacity</p>
                    <p className="text-sm text-foreground/60">Slightly muted</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-foreground opacity-60 rounded"></div>
                  <div>
                    <p className="font-medium text-foreground/60">60% Opacity</p>
                    <p className="text-sm text-foreground/60">Muted text</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-foreground opacity-20 rounded"></div>
                  <div>
                    <p className="font-medium text-foreground/20">20% Opacity</p>
                    <p className="text-sm text-foreground/60">Subtle borders</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Component Library Section */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-foreground border-b-2 border-foreground/20 pb-2">Component Library</h2>
          
          {/* Button Components */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-foreground">Button Components</h3>
            
            {/* Button Variants */}
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-foreground mb-4">Button Variants</h4>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary">Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="tertiary">Tertiary Button</Button>
                </div>
              </div>
              
              {/* Gradient Button Variants */}
              <div>
                <h4 className="text-lg font-medium text-foreground mb-4">Gradient Button Variants</h4>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary-gradient">Primary Gradient</Button>
                  <Button variant="secondary-gradient">Secondary Gradient</Button>
                  <Button variant="tertiary-gradient">Tertiary Gradient</Button>
                </div>
              </div>
              
              {/* Button Sizes */}
              <div>
                <h4 className="text-lg font-medium text-foreground mb-4">Button Sizes</h4>
                <div className="flex flex-wrap items-center gap-4">
                  <Button variant="primary" size="sm">Small</Button>
                  <Button variant="primary" size="md">Medium</Button>
                  <Button variant="primary" size="lg">Large</Button>
                </div>
              </div>
              
              {/* Button States */}
              <div>
                <h4 className="text-lg font-medium text-foreground mb-4">Button States</h4>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary">Normal</Button>
                  <Button variant="primary" disabled>Disabled</Button>
                </div>
              </div>
              
              {/* Color Showcase */}
              <div>
                <h4 className="text-lg font-medium text-foreground mb-4">Color Values</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-foreground/5 p-4 rounded-lg">
                    <div className="w-full h-12 bg-[#6A1B9A] rounded mb-3"></div>
                    <p className="font-medium text-foreground">Primary</p>
                    <p className="text-sm text-foreground/60">#6A1B9A</p>
                  </div>
                  <div className="bg-foreground/5 p-4 rounded-lg">
                    <div className="w-full h-12 bg-[#B756F2] rounded mb-3"></div>
                    <p className="font-medium text-foreground">Secondary</p>
                    <p className="text-sm text-foreground/60">#B756F2</p>
                  </div>
                  <div className="bg-foreground/5 p-4 rounded-lg">
                    <div className="w-full h-12 bg-[#D9CCFF] rounded mb-3"></div>
                    <p className="font-medium text-foreground">Tertiary</p>
                    <p className="text-sm text-foreground/60">#D9CCFF</p>
                  </div>
                </div>
              </div>
              
              {/* Interactive Example */}
              <div>
                <h4 className="text-lg font-medium text-foreground mb-4">Interactive Example</h4>
                <div className="bg-foreground/5 p-6 rounded-lg">
                  <p className="text-base text-foreground mb-4">
                    Click the buttons below to see them in action:
                  </p>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-3">
                      <Button 
                        variant="primary" 
                        onClick={() => alert('Primary button clicked!')}
                      >
                        Click Me
                      </Button>
                      <Button 
                        variant="secondary" 
                        onClick={() => alert('Secondary button clicked!')}
                      >
                        Try This
                      </Button>
                      <Button 
                        variant="tertiary"
                        onClick={() => alert('Tertiary button clicked!')}
                      >
                        Or This
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button 
                        variant="primary-gradient" 
                        onClick={() => alert('Primary gradient button clicked!')}
                      >
                        Gradient Primary
                      </Button>
                      <Button 
                        variant="secondary-gradient" 
                        onClick={() => alert('Secondary gradient button clicked!')}
                      >
                        Gradient Secondary
                      </Button>
                      <Button 
                        variant="tertiary-gradient"
                        onClick={() => alert('Tertiary gradient button clicked!')}
                      >
                        Gradient Tertiary
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* NavBar Components */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-foreground">Navigation Bar Components</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-foreground mb-4">Basic Navigation Bar</h4>
                <div className="flex justify-center">
                  <NavBar 
                    items={[
                      { label: 'Home' },
                      { label: 'About' },
                      { 
                        label: 'Services',
                        dropdown: [
                          { label: 'Web Development', href: '#' },
                          { label: 'Mobile Apps', href: '#' },
                          { label: 'UI/UX Design', href: '#' }
                        ]
                      },
                      { label: 'Contact' }
                    ]}
                    defaultActiveIndex={0}
                  />
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-foreground mb-4">Navigation with More Items</h4>
                <div className="flex justify-center">
                  <NavBar 
                    items={[
                      { label: 'Dashboard' },
                      { label: 'Projects' },
                      { label: 'Team' },
                      { label: 'Settings' },
                      { label: 'Profile' },
                      { label: 'Help' }
                    ]}
                    defaultActiveIndex={1}
                  />
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-foreground mb-4">Compact Navigation</h4>
                <div className="flex justify-center">
                  <NavBar 
                    items={[
                      { label: 'Docs' },
                      { label: 'API' },
                      { label: 'Blog' }
                    ]}
                    defaultActiveIndex={2}
                  />
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-foreground mb-4">Navigation Bar Features</h4>
                <div className="bg-foreground/5 p-6 rounded-lg">
                  <ul className="space-y-2 text-foreground">
                    <li>• <strong>Primary Color:</strong> Uses #6A1B9A as the base background color</li>
                    <li>• <strong>Hover Effect:</strong> Items turn white background (#FFFFFF) with primary text color on hover</li>
                    <li>• <strong>Active State:</strong> Selected item has white background with primary text color</li>
                    <li>• <strong>Rounded Design:</strong> Consistent with button component styling (rounded-3xl container, rounded-2xl items)</li>
                    <li>• <strong>Interactive:</strong> Click any navigation item to see the active state change</li>
                    <li>• <strong>Responsive:</strong> Adapts to different screen sizes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Testimonials Components */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-foreground">Testimonials Components</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-foreground mb-4">Basic Testimonials Slider</h4>
                <div className="p-8 rounded-lg border border-foreground/10">
                  <Testimonials 
                    testimonials={[
                      {
                        id: 1,
                        name: "Sarah Johnson",
                        designation: "CEO, TechStart Inc.",
                        quote: "This platform has revolutionized how we approach our business processes. The user experience is exceptional and the results speak for themselves.",
                        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
                      },
                      {
                        id: 2,
                        name: "Michael Chen",
                        designation: "Product Manager, InnovateCorp",
                        quote: "The attention to detail and quality of service exceeded our expectations. I would highly recommend this to any growing business.",
                        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                      },
                      {
                        id: 3,
                        name: "Emily Rodriguez",
                        designation: "Marketing Director, CreativeHub",
                        quote: "Working with this team has been a game-changer. Their expertise and dedication to our success is unmatched in the industry.",
                        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
                      }
                    ]}
                  />
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-foreground mb-4">Auto-Playing Testimonials</h4>
                <div className="p-8 rounded-lg border border-foreground/10">
                  <Testimonials 
                    testimonials={[
                      {
                        id: 1,
                        name: "David Park",
                        designation: "CTO, FutureTech Solutions",
                        quote: "The technical implementation was flawless. Our team was impressed by the scalability and performance optimizations.",
                        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                      },
                      {
                        id: 2,
                        name: "Lisa Wang",
                        designation: "Founder, StartupVenture",
                        quote: "From concept to execution, every step was handled with professionalism. The results exceeded our ambitious goals.",
                        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
                      }
                    ]}
                    autoPlay={true}
                    autoPlayInterval={4000}
                  />
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-foreground mb-4">Single Testimonial</h4>
                <div className="p-8 rounded-lg border border-foreground/10">
                  <Testimonials 
                    testimonials={[
                      {
                        id: 1,
                        name: "Alexander Thompson",
                        designation: "Senior Developer, CodeCraft",
                        quote: "Clean code, excellent documentation, and outstanding support. This is exactly what every development team needs for success.",
                        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
                      }
                    ]}
                  />
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-foreground mb-4">Testimonials Component Features</h4>
                <div className="bg-foreground/5 p-6 rounded-lg">
                  <ul className="space-y-2 text-foreground">
                    <li>• <strong>Rounded Avatars:</strong> Profile images with purple border (#D9CCFF) and fallback to generated avatars</li>
                    <li>• <strong>Person Details:</strong> Name in primary color (#6A1B9A) with designation as subtitle</li>
                    <li>• <strong>Quote Display:</strong> Styled blockquote with decorative quotation marks</li>
                    <li>• <strong>Navigation Arrows:</strong> Consistent with Button component styling with hover effects</li>
                    <li>• <strong>Dot Indicators:</strong> Visual indicators showing current slide position</li>
                    <li>• <strong>Auto-Play:</strong> Optional automatic slide progression with customizable intervals</li>
                    <li>• <strong>Responsive Design:</strong> Adapts to different screen sizes</li>
                    <li>• <strong>Accessibility:</strong> Proper ARIA labels and keyboard navigation support</li>
                    <li>• <strong>Error Handling:</strong> Graceful fallback for missing images and empty testimonials</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* VerticalListing Components */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-foreground">Vertical Listing Components</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-medium text-foreground mb-4">Service Options</h4>
                <VerticalListing
                  title="Our Services"
                  items={[
                    {
                      id: 1,
                      title: "Web Development",
                      description: "Custom web applications built with modern technologies and best practices.",
                      buttonText: "Choose Service"
                    },
                    {
                      id: 2,
                      title: "Mobile App Development",
                      description: "Native and cross-platform mobile applications for iOS and Android.",
                      buttonText: "Choose Service"
                    },
                    {
                      id: 3,
                      title: "UI/UX Design",
                      description: "User-centered design solutions that enhance user experience and engagement.",
                      buttonText: "Choose Service"
                    },
                    {
                      id: 4,
                      title: "Consulting",
                      description: "Strategic technology consulting to help your business grow and succeed.",
                      buttonText: "Choose Service"
                    }
                  ]}
                  onItemSelect={(itemId) => console.log('Selected service:', itemId)}
                />
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-foreground mb-4">Pricing Plans (Compact)</h4>
                <VerticalListing
                  title="Choose Your Plan"
                  items={[
                    {
                      id: 'basic',
                      title: "Basic Plan",
                      description: "Perfect for small projects and startups. Includes essential features.",
                      buttonText: "Select Basic"
                    },
                    {
                      id: 'premium',
                      title: "Premium Plan",
                      description: "Ideal for growing businesses. Advanced features and priority support.",
                      buttonText: "Select Premium"
                    },
                    {
                      id: 'enterprise',
                      title: "Enterprise Plan",
                      description: "For large organizations. Custom solutions and dedicated support.",
                      buttonText: "Select Enterprise"
                    }
                  ]}
                  selectedItemId="premium"
                  onItemSelect={(itemId) => console.log('Selected plan:', itemId)}
                />
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-foreground mb-4">VerticalListing Features</h4>
              <div className="bg-foreground/5 p-6 rounded-lg">
                <ul className="space-y-2 text-foreground">
                  <li>• <strong>Card Background:</strong> Uses #D9D9D9 background color with rounded corners</li>
                  <li>• <strong>Primary Color Title:</strong> Title uses #6A1B9A primary color</li>
                  <li>• <strong>Selectable Buttons:</strong> Each item has a selectable button with hover effects</li>
                  <li>• <strong>Responsive Design:</strong> Adapts to different screen sizes</li>
                  <li>• <strong>Two Variants:</strong> Default and compact variants available</li>
                  <li>• <strong>Interactive:</strong> Supports onClick handlers and selection state management</li>
                  <li>• <strong>Flexible Content:</strong> Supports title, description, and custom button text</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* TimetableComponent Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-foreground border-b-2 border-foreground/20 pb-2">Timetable Component</h2>
          
          <div>
            <h4 className="text-lg font-medium text-foreground mb-4">Exam Timetables & Schedules</h4>
            <div className="border border-foreground/10 rounded-lg">
              <TimetableComponent 
                showInfoAlert={false}
                examSections={[
                  {
                    id: 'special-ug',
                    title: 'Special Examinations - I Year UG',
                    icon: <Star className="w-5 h-5" />,
                    badges: [
                      { text: 'Special', variant: 'special' },
                      { text: 'UG', variant: 'ug' },
                      { text: 'New', variant: 'new' }
                    ],
                    links: [
                      {
                        href: 'https://www.rajalakshmi.org/downloads/coe/I_YEAR_UG_SETT_Odd_24-25.pdf',
                        title: 'I Year UG - Special Exam Timetable',
                        subtitle: 'Odd Semester 2024-25',
                        icon: <FileText className="w-5 h-5" />,
                        fileType: 'PDF'
                      }
                    ]
                  },
                  {
                    id: 'ug-end-semester',
                    title: 'End Semester Examinations - UG (B.E./B.Tech.)',
                    icon: <GraduationCap className="w-5 h-5" />,
                    badges: [
                      { text: 'UG', variant: 'ug' },
                      { text: 'Apr/May 2025', variant: 'new' }
                    ],
                    links: [
                      {
                        href: 'https://www.rajalakshmi.org/downloads/coe/Timetable-ES-UG-May2025-R2023.pdf',
                        title: 'R2023 - I Year UG - Regular & Arrear',
                        subtitle: 'Even Semester 2024-25',
                        icon: <FileText className="w-5 h-5" />,
                        fileType: 'PDF'
                      },
                      {
                        href: 'https://www.rajalakshmi.org/downloads/coe/II_YEAR_UG_ESE_R2023_Even_24-25.pdf',
                        title: 'R2023 - II Year UG (Regular & Arrear)',
                        subtitle: 'Even Semester 2024-25',
                        icon: <FileText className="w-5 h-5" />,
                        fileType: 'PDF'
                      },
                      {
                        href: 'https://www.rajalakshmi.org/downloads/coe/R2019_UG_Honors_Even_24-25.pdf',
                        title: 'R2019 - UG Honors Degree',
                        subtitle: 'Even Semester 2024-25',
                        icon: <Medal className="w-5 h-5" />,
                        fileType: 'PDF'
                      }
                    ]
                  },
                  {
                    id: 'pg-end-semester',
                    title: 'End Semester Examinations - PG (M.E./M.Tech./MBA)',
                    icon: <User className="w-5 h-5" />,
                    badges: [
                      { text: 'PG', variant: 'pg' },
                      { text: 'Apr/May 2025', variant: 'new' }
                    ],
                    links: [
                      {
                        href: 'https://www.rajalakshmi.org/downloads/coe/Timetable-ES-PG-May2025-R2023.pdf',
                        title: 'M.E./M.Tech. - R2023 (Regular & Arrear)',
                        subtitle: 'Apr/May 2025 - Even 2024-25',
                        icon: <FileText className="w-5 h-5" />,
                        fileType: 'PDF'
                      },
                      {
                        href: 'https://www.rajalakshmi.org/downloads/coe/Timetable-ES-MBA-May2025-R2023.pdf',
                        title: 'MBA - R2023',
                        subtitle: 'End Sem Exam - Even 2024-25',
                        icon: <FileText className="w-5 h-5" />,
                        fileType: 'PDF'
                      }
                    ]
                  },
                  {
                    id: 'model-exams',
                    title: 'Model Examinations',
                    icon: <ClipboardCheck className="w-5 h-5" />,
                    badges: [
                      { text: 'UG', variant: 'ug' },
                      { text: 'Even Semester 2024-25', variant: 'new' }
                    ],
                    links: [
                      {
                        href: 'https://www.rajalakshmi.org/downloads/coe/ModelExam-2024-25-ES-IVYear.pdf',
                        title: 'Model Exam - IV Year',
                        subtitle: 'Time Table',
                        icon: <FileText className="w-5 h-5" />,
                        fileType: 'PDF'
                      },
                      {
                        href: 'https://www.rajalakshmi.org/downloads/coe/ModelExam-2024-25-ES-IIIYear.pdf',
                        title: 'Model Exam - III Year',
                        subtitle: 'Time Table',
                        icon: <FileText className="w-5 h-5" />,
                        fileType: 'PDF'
                      }
                    ]
                  }
                ]}
              />
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-foreground mb-4">TimetableComponent Features</h4>
            <div className="bg-foreground/5 p-6 rounded-lg">
              <ul className="space-y-2 text-foreground">
                <li>• <strong>Card-based Layout:</strong> Each exam section displayed in individual cards with hover effects</li>
                <li>• <strong>Badge System:</strong> Color-coded badges for different exam types (UG, PG, Special, etc.)</li>
                <li>• <strong>Icon Integration:</strong> Uses Lucide React icons for visual enhancement</li>
                <li>• <strong>External Links:</strong> Direct PDF downloads with visual indicators</li>
                <li>• <strong>Responsive Design:</strong> Adapts to mobile and desktop screen sizes</li>
                <li>• <strong>Hover Animations:</strong> Card lift and color transitions on hover</li>
                <li>• <strong>Info Alert:</strong> Contextual information about the Controller of Examinations office</li>
                <li>• <strong>File Type Indicators:</strong> Shows PDF file type badges for downloads</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Sample Content Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-foreground border-b-2 border-foreground/20 pb-2">Sample Content</h2>
          
          <div className="bg-foreground/5 p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-foreground mb-4">About Montserrat</h3>
            <p className="text-base text-foreground mb-4 leading-relaxed">
              Montserrat is a geometric sans-serif typeface designed by Argentine graphic designer Julieta Ulanovsky, 
              inspired by the early 20th century urban typography in the Montserrat neighborhood of Buenos Aires.
            </p>
            <p className="text-base text-foreground/80 mb-4 leading-relaxed">
              The typeface is characterized by its clean, modern appearance and excellent readability across different 
              sizes and weights, making it perfect for both headings and body text.
            </p>
            <blockquote className="border-l-4 border-foreground/20 pl-4 italic text-foreground/70">
              Typography is the craft of endowing human language with a durable visual form.
            </blockquote>
          </div>

          {/* ImageFrameRect Demo */}
          <div className="flex flex-wrap gap-4 sm:gap-8 items-center justify-center bg-foreground/5 p-4 sm:p-8 rounded-lg">
            <ImageFrameRect
              imageUrl="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=300&h=400&fit=crop"
              number={1}
              name="John Doe"
              imageAlt="Portrait of John Doe"
            />
            <ImageFrameRect
              imageUrl="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=400&fit=crop"
              number={2}
              name="Jane Smith"
              imageAlt="Portrait of Jane Smith"
            />
          </div>
        </section>

        {/* Blog Cards Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-foreground border-b-2 border-foreground/20 pb-2">Blog Card Components</h2>
          
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-foreground">Featured Blog Posts</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              <BlogCard
                tag="Technology"
                tagColor="bg-[#6A1B9A] text-white"
                coverImage="https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop"
                coverImageAlt="Modern technology workspace"
                title="The Future of Web Development"
                description="Exploring the latest trends in web technology, from serverless architecture to AI-powered development tools. This comprehensive guide covers everything you need to know about modern web development practices and emerging technologies that are shaping the future of digital experiences."
                href="#"
              />
              
              <BlogCard
                tag="Design"
                tagColor="bg-[#B756F2] text-white"
                coverImage="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop"
                coverImageAlt="Creative design workspace"
                title="UI/UX Design Principles"
                description="Master the art of creating user-centered designs that not only look beautiful but also provide exceptional user experiences. Learn about color theory, typography, layout principles, and how to conduct effective user research."
                href="#"
              />
              
              <BlogCard
                tag="Business"
                tagColor="bg-[#D9CCFF] text-foreground"
                coverImage="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=250&fit=crop"
                coverImageAlt="Business meeting"
                title="Building Successful Teams"
                description="Discover the key strategies for building and managing high-performing teams in today's remote-first world. From communication tools to team dynamics, learn what it takes to create a collaborative work environment."
                maxDescriptionLength={100}
                href="#"
              />
            </div>
            
            
            
            <div>
              <h4 className="text-lg font-medium text-foreground mb-4">BlogCard Component Features</h4>
              <div className="bg-foreground/5 p-6 rounded-lg">
                <ul className="space-y-2 text-foreground">
                  <li>• <strong>Tag Badge:</strong> Positioned at top-left with customizable colors and text</li>
                  <li>• <strong>Cover Image:</strong> Aspect ratio optimized with hover zoom effect</li>
                  <li>• <strong>Title:</strong> Responsive text with line clamping for consistent layout</li>
                  <li>• <strong>Description Truncation:</strong> Configurable character limit with ellipsis</li>
                  <li>• <strong>Interactive Options:</strong> Supports both href links and onClick handlers</li>
                  <li>• <strong>Hover Effects:</strong> Smooth transitions for enhanced user experience</li>
                  <li>• <strong>Responsive Design:</strong> Adapts perfectly to different screen sizes</li>
                  <li>• <strong>Accessibility:</strong> Proper image alt tags and semantic markup</li>
                  <li>• <strong>Color Consistency:</strong> Uses the same color scheme as other components</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-foreground/20">
          <p className="text-sm text-foreground/60">
            This showcase demonstrates the Montserrat font family with custom color scheme and component library
          </p>
        </footer>

      </div>
    </div>
  );
}
