import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold text-lg mb-4">Logo</h3>
          <p>Subscribe to our newsletter for the latest updates on features and releases.</p>
          <div className="flex mt-4">
            <input type="email" placeholder="Your email address" className="p-2 rounded-l text-gray bg-gray-700" />
            <button className="bg-blue-500 p-2 rounded-r">Join</button>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-4">Quick Links</h3>
          <ul>
            <li><Link href="/about" className="hover:underline">About Us</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact Us</Link></li>
            <li><Link href="/support" className="hover:underline">Support</Link></li>
            <li><Link href="/careers" className="hover:underline">Careers</Link></li>
            <li><Link href="/blog" className="hover:underline">Blog</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-4">Connect With Us</h3>
          <ul>
            <li><a href="#" className="hover:underline">Facebook</a></li>
            <li><a href="#" className="hover:underline">Instagram</a></li>
            <li><a href="#" className="hover:underline">Twitter</a></li>
            <li><a href="#" className="hover:underline">LinkedIn</a></li>
            <li><a href="#" className="hover:underline">YouTube</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-4">Legal</h3>
          <ul>
            <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:underline">Terms of Service</Link></li>
            <li><Link href="/cookies" className="hover:underline">Cookie Settings</Link></li>
          </ul>
        </div>
      </div>
      <div className="text-center mt-8 text-sm">
        <p>© 2025 Surgence. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
