export interface Feed {
    created_at: string; // Data de criação
    entry_id: number;   // ID da entrada
    field1?: string;    // Tensão
    field2?: string;    // Temperatura
  }
  
  export interface Channel {
    id: number;
    name: string;
    field1: string;
    field2: string;
    created_at: string;
    updated_at: string;
    last_entry_id: number;
  }
  
  export interface ChannelResponse {
    channel: Channel;
    feeds: Feed[];
  }
  