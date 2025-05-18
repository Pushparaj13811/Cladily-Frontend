import { COMPANY, NAVIGATION } from '@shared/constants';
import { Link } from 'react-router-dom';

interface FooterLinkItem {
  name: string;
  href: string;
}

interface FooterSectionProps {
  title: string;
  items: FooterLinkItem[];
}

const FooterSection: React.FC<FooterSectionProps> = ({ title, items }) => (
  <div className="space-y-4">
    <h3 className="text-sm font-medium">{title}</h3>
    <ul className="space-y-2 text-sm">
      {items.map((item) => (
        <li key={item.href}>
          <Link to={item.href} className="text-muted-foreground hover:text-foreground">
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

interface SocialIconProps {
  href: string;
  label: string;
  children: React.ReactNode;
}

const SocialIcon: React.FC<SocialIconProps> = ({ href, label, children }) => (
  <a href={href} className="hover:text-foreground text-muted-foreground">
    <span className="sr-only">{label}</span>
    {children}
  </a>
);

export function MainFooter() {
  return (
    <footer className="border-t border-border py-8 mt-16 bg-[#e6e6e6]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <FooterSection 
            title="Customer Service" 
            items={NAVIGATION.FOOTER.CUSTOMER_SERVICE} 
          />
          <FooterSection 
            title="About" 
            items={NAVIGATION.FOOTER.ABOUT} 
          />
          <FooterSection 
            title="Legal" 
            items={NAVIGATION.FOOTER.LEGAL} 
          />
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Follow us</h3>
            <div className="flex space-x-4">
              <SocialIcon href={COMPANY.SOCIAL.INSTAGRAM} label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </SocialIcon>
              <SocialIcon href={COMPANY.SOCIAL.TWITTER} label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </SocialIcon>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 border-white text-center text-xs text-muted-foreground">
          <p>{COMPANY.COPYRIGHT}</p>
        </div>
      </div>
    </footer>
  );
} 