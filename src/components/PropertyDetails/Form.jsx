import { Textarea, Image, VStack, HStack, Box, Text, Input, Button } from '@chakra-ui/react'

const Form = ({searchedHouse}) => {
  return (
    <VStack border='1px' borderColor='light.cardBackground' boxShadow='md' px='5' py='6' bg="light.cardBackground">
        <HStack>
            <Image borderRadius='full' boxSize='75px' src={searchedHouse.agent.image} />
            <Box>
                <Text mb='-3px' fontWeight='extrabold' fontSize='15px' color="light.darkText">{searchedHouse.agent.name}</Text>
                <Text style={{fontSize: '12px'}} color="light.darkText">+{searchedHouse.agent.phone}</Text>
            </Box>
        </HStack>

        <VStack my='3px' spacing='2px'>
            <form>
                <Input mt='3' mb='2' placeholder="Name*" />
                <Input placeholder="Email*" />
                <Input my='2' placeholder="Phone*" />
                <Textarea my='2' placeholder='Message*' size='sm'  defaultValue='Hello, I am interested in [Modern apartment]' />
                <HStack my='2'>
                    <Button w='full' px='4' colorScheme="brand">Send Message</Button>
                    <Button w={{base: 'full', md: '50%'}} variant='outline' borderColor="brand.primary" color="brand.primary" _hover={{ bg: 'brand.primary', color: 'white' }}>Call</Button>
                </HStack>
            </form>
        </VStack>
    </VStack>
  )
}

export default Form