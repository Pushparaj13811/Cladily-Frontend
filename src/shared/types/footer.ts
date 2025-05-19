interface FooterLinkItem {
    name: string;
    href: string;
}

interface FooterSectionProps {
    title: string;
    items: FooterLinkItem[];
}


interface SocialIconProps {
    href: string;
    label: string;
    children: React.ReactNode;
  }
  

export type { FooterLinkItem, FooterSectionProps, SocialIconProps };