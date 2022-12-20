import { gql } from "@apollo/client";

export const FILMS_QUERY = gql`
query FILMS_QUERY($symbol: [String!]!, $start: DateTime!, $end: DateTime!, $resample: TimeSpan! ) {
  symbols(symbols: $symbol) {
    priceInfo {
      chartData (start: $start, end: $end, resample: $resample) {
        date
        low
        high
        open
        close
        volume
        indicators {
          adx
          mdi
          sma
          macd
        }
      }
    }
  }
}
`;