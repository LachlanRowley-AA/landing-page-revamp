import { audienceContent, AudienceKey } from '@/lib/audienceContent';
import HomePageClient from '@/components/Homepage/HomepageClient';
import { textKey } from '@/lib/audienceContent';
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
      showDescription={audience==='design'}
      // textKey={audience === 'design' ? 'monica' : 'empty'}
    />
  );
}