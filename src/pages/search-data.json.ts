import type { APIRoute } from 'astro';
import { generateSearchData } from '../utils/searchData';

export const GET: APIRoute = async () => {
  try {
    const searchData = await generateSearchData();
    
    return new Response(JSON.stringify(searchData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, s-maxage=300', // Cache for 5 minutes
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error generating search data:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Failed to generate search data',
      data: []
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};
