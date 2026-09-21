import React from 'react';
import FetchProducts from './FetchProducts';

export default function Home({ theOrderCode }) {
  return (
    <div>
      <FetchProducts theOrderCode={theOrderCode} />
    </div>
  );
}
