import { Hero03 } from '@/components/Hero03';
import { Feature02 } from '@/components/feature-02';
import { Calculator } from '@/components/Calculator2/Calculator';
import { Footer01 } from '@/components/footer/footer';
import { FAQ } from '@/components/FAQ/Faq';
import { ContactForm } from '@/components/Contact/Contact';
import { Suspense } from 'react';
import { UseCases} from '@/components/UseCases2/Usecases';
import { audienceContent, AudienceKey } from '@/lib/audienceContent';


export default async function HomePage(props: { params: Promise<{ audience: string, partner: string}>}) {
  const params = await props.params;
  const audience = params.audience as AudienceKey
  const partner = 'harmon';

  const content = audienceContent[audience];
  return (
    <>
      <Suspense><Hero03 partner={partner}/></Suspense>
      <Feature02 features={content?.features}/>
      <Calculator />
      <UseCases />
      {/* <Suspense><Benefits /></Suspense> */}
      <FAQ />
      <ContactForm referrer={partner} />
      <section id="footer"><Footer01 /></section>
    </>
  );
}
