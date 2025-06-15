import { Hero03 } from '@/components/Hero03/index';
import { Feature02 } from '@/components/feature-02';
import { Calculator } from '@/components/Calculator/Calculator';
import { Footer01 } from '@/components/footer/footer';
import { FAQ } from '@/components/FAQ/Faq';
import { ContactForm } from '@/components/Contact/Contact';
import { Suspense } from 'react';
import { UseCases as Benefits} from '@/components/Benefits/Benefits';
import { audienceContent, AudienceKey } from '@/lib/audienceContent';


export default function HomePage( {params} : { params: { audience: string}}) {
  const audience = params.audience as AudienceKey

  const content = audienceContent[audience];
  return (
    <>
      <Suspense><Hero03 /></Suspense>
      <Feature02 features={content?.features}/>
      <Calculator />
      {/* <UseCases /> */}
      <Suspense><Benefits /></Suspense>
      <FAQ />
      <ContactForm />
      <Footer01 />
    </>
  );
}
