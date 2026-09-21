import React from 'react';
import { Phone, Whatsapp } from 'react-bootstrap-icons';
import CourierDirections from './CourierDirections';

export default function ContactUs() {
  return (
    <div>
      <p>
        
        Phone Call Us<Phone size={20} className="mr-2" /> At: 0766682639
      </p>
      <p>
       
        Whatsapp Us<Whatsapp size={20} className="mr-2" /> At: 0766682639
      </p>
    </div>
  );
}
