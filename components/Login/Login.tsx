import { Card, Stack, TextInput } from '@mantine/core'

export default function Login() {
    return (
        <Card>
            <Stack>
                <TextInput
                    label='Username'
                />
                <TextInput
                    label='Password'
                />
            </Stack>
        </Card>
    )
}