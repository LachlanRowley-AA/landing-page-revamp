import Loans from '@/components/Loans'

export default async function Page(props:{params: Promise<{index: number}>}) {
    const params = await props.params;
    return (
        <Loans calculatorIndex={params.index}/>
    )
}