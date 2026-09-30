import { graphql } from './gql';

export const MenuQuery = graphql(`
  query Menu($category: Category) {
    menu(category: $category) {
      count
      items { id category name description price veg }
    }
  }
`);

export const PlaceOrderMutation = graphql(`
  mutation PlaceOrder($input: PlaceOrderInput!) {
    placeOrder(input: $input) {
      id status total subtotal deliveryFee etaMinutes
      items { name qty price }
    }
  }
`);
