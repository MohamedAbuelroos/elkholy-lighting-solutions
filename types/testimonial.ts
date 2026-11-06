export type Testimonial = {
  id: string;
  name: string;
  context: string;
  quote: string;
  rating: 1 | 2 | 3 | 4 | 5;
  is_active: boolean;
  sort_order: number;
};
