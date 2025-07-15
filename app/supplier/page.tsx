import { UseCases } from '@/components/UseCases/Usecases';
import { Hero03 } from '@/components/Hero03/index';
import { Feature02 } from '@/components/feature-02';
import { Calculator } from '@/components/Calculator3/Calculator';
import { Footer01 } from '@/components/footer/footer';
import { FAQ } from '@/components/FAQ/Faq';
import { ContactForm } from '@/components/Contact/Contact';
import { Suspense } from 'react';
import { UseCases as Benefits} from '@/components/Benefits/Benefits';

export default function HomePage() {
  return (
    <>
      <Suspense><Hero03 /></Suspense>
      <Feature02 />
      <Calculator />
      {/* <UseCases /> */}
      <Suspense><Benefits /></Suspense>
      <FAQ />
      <ContactForm />
      <Footer01 />
    </>
  );
}
