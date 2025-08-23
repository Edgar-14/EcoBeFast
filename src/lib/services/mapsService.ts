// Google Maps Geocoding service
export class MapsService {
  private static apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Geocode address to coordinates
  static async geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    if (!this.apiKey) {
      console.warn('Google Maps API key not configured');
      return null;
    }

    try {
      const encodedAddress = encodeURIComponent(address);
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${this.apiKey}`
      );

      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return {
          lat: location.lat,
          lng: location.lng
        };
      } else {
        console.error('Geocoding failed:', data.status, data.error_message);
        return null;
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  }

  // Calculate distance between two points (in kilometers)
  static calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Estimate delivery time based on distance
  static estimateDeliveryTime(distanceKm: number): number {
    // Average speed in urban areas: 20 km/h
    // Add 10 minutes base time for pickup and delivery
    const baseTimeMinutes = 10;
    const travelTimeMinutes = (distanceKm / 20) * 60;
    
    return Math.ceil(baseTimeMinutes + travelTimeMinutes);
  }

  // Calculate delivery cost based on distance
  static calculateDeliveryCost(distanceKm: number): number {
    const baseCost = 50; // Base cost in MXN
    const perKmCost = 10; // Cost per kilometer
    
    return Math.ceil(baseCost + (distanceKm * perKmCost));
  }

  // Get directions URL for Google Maps
  static getDirectionsUrl(
    origin: string,
    destination: string,
    waypoints?: string[]
  ): string {
    const baseUrl = 'https://www.google.com/maps/dir/';
    let url = baseUrl + encodeURIComponent(origin);
    
    if (waypoints && waypoints.length > 0) {
      url += '/' + waypoints.map(w => encodeURIComponent(w)).join('/');
    }
    
    url += '/' + encodeURIComponent(destination);
    
    return url;
  }

  // Validate Mexican address format
  static validateMexicanAddress(address: string): boolean {
    // Basic validation for Mexican addresses
    const mexicanAddressPattern = /^[^,]+,\s*[^,]+,\s*[^,]+,\s*(México|Mexico|MX|CDMX|Ciudad de México)/i;
    return mexicanAddressPattern.test(address.trim());
  }

  // Format address for display
  static formatAddress(address: string): string {
    return address
      .split(',')
      .map(part => part.trim())
      .filter(part => part.length > 0)
      .join(', ');
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

// Address autocomplete service
export class AddressAutocompleteService {
  private static apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Get address suggestions using Google Places API
  static async getAddressSuggestions(
    input: string,
    location?: { lat: number; lng: number },
    radius = 50000 // 50km radius
  ): Promise<Array<{ description: string; placeId: string }>> {
    if (!this.apiKey || input.length < 3) {
      return [];
    }

    try {
      let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${this.apiKey}&types=address&components=country:mx`;
      
      if (location) {
        url += `&location=${location.lat},${location.lng}&radius=${radius}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        return data.predictions.map((prediction: any) => ({
          description: prediction.description,
          placeId: prediction.place_id
        }));
      }

      return [];
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      return [];
    }
  }

  // Get detailed address info from place ID
  static async getPlaceDetails(placeId: string): Promise<{
    address: string;
    coordinates: { lat: number; lng: number };
    formattedAddress: string;
  } | null> {
    if (!this.apiKey) {
      return null;
    }

    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${this.apiKey}&fields=formatted_address,geometry`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.result) {
        const result = data.result;
        return {
          address: result.formatted_address,
          coordinates: {
            lat: result.geometry.location.lat,
            lng: result.geometry.location.lng
          },
          formattedAddress: result.formatted_address
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching place details:', error);
      return null;
    }
  }
}