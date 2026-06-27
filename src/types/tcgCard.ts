export type TcgGame = 'pokemon' | 'one_piece'

export type TcgCard = {
  id: string
  game: TcgGame
  name: string
  setName: string
  setCode: string
  cardNumber: string
  rarity: string
  typeLine: string
  imageUrl: string
  sourceUrl: string
  language: string
  tags: string[]
}
