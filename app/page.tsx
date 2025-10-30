import { audienceContent, AudienceKey, textKey } from '@/lib/audienceContent';
import HomePageClient from '@/components/Homepage/HomepageClient';
// This is the Server Component
export default async function HomePage(props: { params: Promise<{ audience: string, partner: string}>}) {
  const params = await props.params;
  const audience = params.audience as AudienceKey
  const content = audienceContent[audience];
  console.log(audience==='design');
  return (
    <HomePageClient 
      audience={audience}
      content={content}
      showDescription={false}
      // textKey={audience === 'design' ? 'monica' : 'empty'}
    />
  );
}