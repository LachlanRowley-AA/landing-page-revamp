'use client';
import { Hero03 } from '@/components/Hero03';
import { Feature02 } from '@/components/feature-02';
import { Calculator } from '@/components/Calculator3/Calculator';
import { Footer01 } from '@/components/footer/footer';
import { FAQ } from '@/components/FAQ/Faq';
import { ContactForm } from '@/components/Contact/Contact';
import { Suspense, useState, useEffect } from 'react';
import { UseCases} from '@/components/UseCases/Usecases';
import { AudienceKey, textKey } from '@/lib/audienceContent';
import { Loader } from '@mantine/core';
import { DynamicTextDisplay } from '@/components/Description';

interface HomePageClientProps {
  audience: AudienceKey;
  partner?: string;
  content: any;
  calculatorValue?: number;
  showDescription?: boolean;
  textKey?: textKey
}

export default function HomePageClient({ audience, partner, content, calculatorValue, showDescription = false,
  textKey = 'empty'
 }: HomePageClientProps) {
  const [isPageReady, setIsPageReady] = useState(false);
  const [heroData, setHeroData] = useState<{
    has_black: boolean;
    has_white: boolean;
  }>({ has_black: false, has_white: false });
  const [calculatorValueState, setCalculatorValueState] = useState(calculatorValue || 30000);

  // Pre-load hero data before rendering anything
  useEffect(() => {
    const preloadHeroData = async () => {
      if (!partner) {
        setIsPageReady(true);
        return;
      }

      console.log('Preloading hero data for partner:', partner);
      
      try {
        // Check black logo first
        const blackResponse = await fetch(`/${partner}/logo_black.png`, { method: 'HEAD' });
        const contentLength = blackResponse.headers.get('content-length');
        const isValidBlackImage = blackResponse.ok && contentLength && parseInt(contentLength, 10) > 0;
        
        if (isValidBlackImage) {
          setHeroData(prev => ({ ...prev, has_black: true }));
        } else {
          // Check white logo if black not found
          try {
            const whiteResponse = await fetch(`/${partner}/logo_white.png`, { method: 'HEAD' });
            const whiteContentLength = whiteResponse.headers.get('content-length');
            const isValidWhiteImage = whiteResponse.ok && whiteContentLength && parseInt(whiteContentLength, 10) > 0;
            
            if (isValidWhiteImage) {
              setHeroData(prev => ({ ...prev, has_white: true }));
            }
          } catch (error) {
            console.log('White logo check failed:', error);
          }
        }
      } catch (error) {
        console.log('Logo check failed:', error);
        // Try white logo as fallback
        try {
          const whiteResponse = await fetch(`/${partner}/logo_white.png`, { method: 'HEAD' });
          if (whiteResponse.ok) {
            setHeroData(prev => ({ ...prev, has_white: true }));
          }
        } catch (fallbackError) {
          console.log('Fallback logo check failed:', fallbackError);
        }
      }
      
      // Small delay to ensure smooth transition
      setTimeout(() => {
        setIsPageReady(true);
      }, 300);
    };

    preloadHeroData();
  }, [partner]);

  // Show full-page loading screen until everything is ready
  if (!isPageReady) {
    return (
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        zIndex: 9999, 
        backgroundColor: 'black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <Loader size="xl" color='#01E194'/>
        <div style={{ 
          fontSize: '18px', 
          color: '#FFF',
          fontWeight: 500
        }}>
          Loading...
        </div>
      </div>
    );
  }

  // Render entire page only when ready
  return (
    <div style={{ 
      opacity: 0,
      animation: 'fadeIn 1s ease-in-out forwards'
    }}>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      
      <Hero03 
        partner={partner}
        preloadedData={heroData}
        audience={textKey}
      />
      {showDescription && <DynamicTextDisplay type='monica'/>}
      <Feature02 features={content?.features}/>
      <Calculator startingAmount={calculatorValueState}/>
      <Suspense><UseCases /></Suspense>
      <FAQ />
      <section id="footer"><ContactForm referrer={partner} /></section>
      <Footer01 />
    </div>
  );
}