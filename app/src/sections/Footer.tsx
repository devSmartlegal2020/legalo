import { Linkedin, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Layanan: [
      { label: 'Pendirian PT', href: '#services' },
      { label: 'Izin Usaha', href: '#services' },
      { label: 'Merek & HAKI', href: '#services' },
      { label: 'Virtual Office', href: '#services' },
    ],
    Perusahaan: [
      { label: 'Tentang Kami', href: '#about' },
      { label: 'Blog', href: '#blog' },
      { label: 'Kontak', href: '#contact' },
    ],
    Legal: [
      { label: 'Kebijakan Privasi', href: '#' },
      { label: 'Syarat & Ketentuan', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
  ];

  const scrollToSection = (href: string) => {
    if (href === '#') return;
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-legalo-dark text-white py-16 lg:py-20">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16 mb-12">
            <div className="col-span-2 md:col-span-1">
              <a href="#" className="font-heading font-bold text-xl mb-4 block">Legalo<span className="text-legalo-red">.</span>id</a>
              <p className="text-white/50 text-sm leading-relaxed mb-6">Legal services and virtual office solutions for modern Indonesian businesses.</p>
              <div className="flex gap-2">
                {socialLinks.map((social, index) => (
                  <a key={index} href={social.href} aria-label={social.label} className="w-9 h-9 rounded-lg bg-white/5 hover:bg-legalo-red flex items-center justify-center transition-colors">
                    <social.icon className="w-4 h-4" strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            </div>
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="font-heading font-semibold text-sm mb-4">{title}</h4>
                <ul className="space-y-2.5">
                  {links.map((link, index) => (
                    <li key={index}>
                      <button onClick={() => scrollToSection(link.href)} className="text-white/50 hover:text-white text-sm transition-colors">{link.label}</button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-white/40 text-sm">© {currentYear} Legalo.id. All rights reserved.</p>
              <p className="text-white/40 text-xs">Terdaftar di Kemenkumham RI</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
