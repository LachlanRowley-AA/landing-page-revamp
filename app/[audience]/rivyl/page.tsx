import { audienceContent, AudienceKey } from '@/lib/audienceContent';
import HomePageClient from '@/components/Homepage/HomepageClient';

// This is the Server Component
export default async function HomePage(props: { params: Promise<{ audience: string, partner: string}>}) {
  const params = await props.params;
  const audience = params.audience as AudienceKey
  const partner = 'rivyl';
  const content = audienceContent[audience];
  
  return (
    <HomePageClient 
      audience={audience}
      partner={partner}
      content={content}
      calculatorValue={60000}
    />
  );
}