export interface Game {
    id: string;
    name: string;
    image: string;        // capa vertical (library_600x900)
    bannerImage?: string;  // banner de fundo (header.jpg)
    rating: number;
    dateFinished: string;
}