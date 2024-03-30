import React, { lazy, Suspense } from 'react';

const LazySignup = lazy(() =>  import('./imgLoading'));

const LazyImage = ({ src, classname }) => {
  return (  
    <Suspense fallback={<div className='custom-loader_div'>

<div className="custom-loader"></div>
</div>}>
      <LazySignup src={src} classname={classname} />
    </Suspense>
  );
};

export default LazyImage;
