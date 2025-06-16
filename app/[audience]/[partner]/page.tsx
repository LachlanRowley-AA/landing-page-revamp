import { Hero03 } from '@/components/Hero03';
import { Feature02 } from '@/components/feature-02';
import { Calculator } from '@/components/Calculator/Calculator';
import { Footer01 } from '@/components/footer/footer';
import { FAQ } from '@/components/FAQ/Faq';
import { ContactForm } from '@/components/Contact/Contact';
import { Suspense } from 'react';
import { UseCases as Benefits} from '@/components/Benefits/Benefits';
import { audienceContent, AudienceKey } from '@/lib/audienceContent';


export default async function HomePage(props: { params: Promise<{ audience: string, partner: string}>}) {
  const params = await props.params;
  const audience = params.audience as AudienceKey
  const partner = params.partner

  const content = audienceContent[audience];
  return (
    <>
      <Suspense><Hero03 partner={partner}/></Suspense>
      <Feature02 features={content?.features}/>
      <Calculator />
      {/* <UseCases /> */}
      <Suspense><Benefits /></Suspense>
      <FAQ />
      <ContactForm referrer={partner} />
      <Footer01 />
    </>
  );
}
