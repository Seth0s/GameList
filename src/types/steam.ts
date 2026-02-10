export interface SteamGame {
    id: string;
    name: string;
    image: string;         // capa vertical (library_600x900)
    bannerImage?: string;  // banner de fundo (header.jpg)
    // Campos abaixo só existem após getGameDetails (não vêm do search)
    description?: string;
    releasedDate?: string;
    metacriticScore?: number;
}
