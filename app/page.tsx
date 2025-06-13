import { UseCases } from '@/components/UseCases/Usecases';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Welcome } from '../components/Welcome/Welcome';
import { Hero03 } from '@/components/Hero03/index';
import { Feature02 } from '@/components/feature-02';
import { Calculator } from '@/components/Calculator/Calculator';
import { Footer01 } from '@/components/footer/footer';
import { FAQ } from '@/components/FAQ/Faq';
import { ContactForm } from '@/components/Contact/Contact';

export default function HomePage() {
  return (
    <>
      <Hero03 />
      <Feature02 />
      <Calculator />
      <UseCases />
      <FAQ />
      <ContactForm />
      <Footer01 />
    </>
  );
}
