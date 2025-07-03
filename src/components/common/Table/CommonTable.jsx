import React from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Flex,
} from '@chakra-ui/react';
import Loader from '../Loader';

const CommonTable = ({
  columns,
  data = [],
  isLoading,
  rowActions,
  onRowClick,
  emptyStateMessage = "No data available",
}) => {
  return (
    <Box
      position="relative"
      overflowX="auto"
      bg="ui.cardBackground"
      borderRadius="lg"
      boxShadow="sm"
      borderWidth="1px"
      borderColor="ui.border"
      p={0}
      sx={{
        'table': { 
          minWidth: { base: '100%', md: '700px' }
        },
        '@media screen and (max-width: 48em)': {
          'table, thead, tbody, tr, th, td': {
            display: 'block',
          },
          'thead tr': {
            position: 'absolute',
            top: '-9999px',
            left: '-9999px',
          },
          'tr': {
            border: '1px solid',
            borderColor: 'ui.border',
            borderRadius: 'lg',
            mb: 4,
            overflow: 'hidden',
            boxShadow: 'md',
          },
          'td': {
            border: 'none',
            position: 'relative',
            paddingLeft: '50%',
            whiteSpace: 'normal',
            textAlign: 'left',
            '&:before': {
              position: 'absolute',
              top: '6px',
              left: '6px',
              width: '45%',
              paddingRight: '10px',
              whiteSpace: 'nowrap',
              textAlign: 'left',
              fontWeight: 'bold',
              content: 'attr(data-label)',
              color: 'brand.dark',
            },
          },
        },
      }}
    >
      {isLoading && (
        <Flex
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(255, 255, 255, 0.7)"
          justify="center"
          align="center"
          zIndex="1"
        >
          <Loader />
        </Flex>
      )}
      <Table variant="simple" size="sm" style={{ opacity: isLoading ? 0.5 : 1 }}>
        <Thead bg="brand.dark" display={{ base: 'none', md: 'table-header-group' }}>
          <Tr>
            {columns.map((column, index) => (
              <Th
                key={column.key}
                color="white"
                fontWeight="semibold"
                fontSize={{ base: '2xs', md: 'xs' }}
                py={{ base: 2, md: 3 }}
                px={{ base: 2, md: 4 }}
                {...(index === 0 && { borderTopLeftRadius: 'lg' })}
                {...(index === columns.length - 1 && !rowActions && { borderTopRightRadius: 'lg' })}
              >
                {column.label}
              </Th>
            ))}
            {rowActions && (
              <Th 
                color="white" 
                fontWeight="semibold" 
                fontSize={{ base: '2xs', md: 'xs' }}
                py={{ base: 2, md: 3 }}
                px={{ base: 2, md: 4 }}
                width={{ base: '60px', md: '100px' }}
                borderTopRightRadius="lg"
              >
                Actions
              </Th>
            )}
          </Tr>
        </Thead>
        <Tbody>
          {!data || data.length === 0 ? (
            <Tr>
              <Td colSpan={columns.length + (rowActions ? 1 : 0)} textAlign="center" py={4}>
                <Text color="gray.500" fontSize={{ base: 'xs', md: 'sm' }}>{emptyStateMessage}</Text>
              </Td>
            </Tr>
          ) : (
            data.map((row, idx) => (
              <Tr
                key={row._id || row.id || idx}
                bg={idx % 2 === 0 ? 'gray.50' : 'white'}
                _hover={{ bg: 'blue.50' }}
                transition="background 0.2s"
                cursor={onRowClick ? 'pointer' : 'default'}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column) => (
                  <Td
                    key={`${column.key}-${row._id || row.id}`}
                    py={{ base: 2, md: 3 }}
                    px={{ base: 2, md: 4 }}
                    fontSize={{ base: 'xs', md: 'sm' }}
                    color="ui.text"
                    height={{ base: '40px', md: '48px' }}
                    data-label={column.label}
                  >
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </Td>
                ))}
                {rowActions && (
                  <Td 
                    py={{ base: 2, md: 3 }}
                    px={{ base: 2, md: 4 }}
                    height={{ base: '40px', md: '48px' }}
                    data-label="Actions"
                  >
                    {rowActions(row)}
                  </Td>
                )}
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default CommonTable; 