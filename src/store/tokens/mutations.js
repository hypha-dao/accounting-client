export const setTokensWithExchange = (state, tokens) => {
  state.tokensWithExchange = tokens.map(token => {
    const { symbol, current_price: currentPrice, id } = token
    return {
      id,
      symbol,
      price: currentPrice
    }
  })
}

export const setTokensWithUserExange = (state, tokens) => {
  state.tokensWithUserExange = tokens
}

export const setExchangeDate = (state, date) => {
  state.exchangeDate = date
}
