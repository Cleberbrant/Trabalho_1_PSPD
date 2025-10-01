import * as jspb from 'google-protobuf'



export class TextRequest extends jspb.Message {
  getText(): string;
  setText(value: string): TextRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TextRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TextRequest): TextRequest.AsObject;
  static serializeBinaryToWriter(message: TextRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TextRequest;
  static deserializeBinaryFromReader(message: TextRequest, reader: jspb.BinaryReader): TextRequest;
}

export namespace TextRequest {
  export type AsObject = {
    text: string,
  }
}

export class WordCountResponse extends jspb.Message {
  getWordCount(): number;
  setWordCount(value: number): WordCountResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WordCountResponse.AsObject;
  static toObject(includeInstance: boolean, msg: WordCountResponse): WordCountResponse.AsObject;
  static serializeBinaryToWriter(message: WordCountResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WordCountResponse;
  static deserializeBinaryFromReader(message: WordCountResponse, reader: jspb.BinaryReader): WordCountResponse;
}

export namespace WordCountResponse {
  export type AsObject = {
    wordCount: number,
  }
}

export class CharCountResponse extends jspb.Message {
  getCharCount(): number;
  setCharCount(value: number): CharCountResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CharCountResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CharCountResponse): CharCountResponse.AsObject;
  static serializeBinaryToWriter(message: CharCountResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CharCountResponse;
  static deserializeBinaryFromReader(message: CharCountResponse, reader: jspb.BinaryReader): CharCountResponse;
}

export namespace CharCountResponse {
  export type AsObject = {
    charCount: number,
  }
}

export class WordChunk extends jspb.Message {
  getWord(): string;
  setWord(value: string): WordChunk;

  getPosition(): number;
  setPosition(value: number): WordChunk;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WordChunk.AsObject;
  static toObject(includeInstance: boolean, msg: WordChunk): WordChunk.AsObject;
  static serializeBinaryToWriter(message: WordChunk, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WordChunk;
  static deserializeBinaryFromReader(message: WordChunk, reader: jspb.BinaryReader): WordChunk;
}

export namespace WordChunk {
  export type AsObject = {
    word: string,
    position: number,
  }
}

export class TotalCountResponse extends jspb.Message {
  getTotalWords(): number;
  setTotalWords(value: number): TotalCountResponse;

  getTotalChars(): number;
  setTotalChars(value: number): TotalCountResponse;

  getTextCount(): number;
  setTextCount(value: number): TotalCountResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TotalCountResponse.AsObject;
  static toObject(includeInstance: boolean, msg: TotalCountResponse): TotalCountResponse.AsObject;
  static serializeBinaryToWriter(message: TotalCountResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TotalCountResponse;
  static deserializeBinaryFromReader(message: TotalCountResponse, reader: jspb.BinaryReader): TotalCountResponse;
}

export namespace TotalCountResponse {
  export type AsObject = {
    totalWords: number,
    totalChars: number,
    textCount: number,
  }
}

export class AnalysisResponse extends jspb.Message {
  getCurrentWords(): number;
  setCurrentWords(value: number): AnalysisResponse;

  getCurrentChars(): number;
  setCurrentChars(value: number): AnalysisResponse;

  getStatus(): string;
  setStatus(value: string): AnalysisResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AnalysisResponse.AsObject;
  static toObject(includeInstance: boolean, msg: AnalysisResponse): AnalysisResponse.AsObject;
  static serializeBinaryToWriter(message: AnalysisResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AnalysisResponse;
  static deserializeBinaryFromReader(message: AnalysisResponse, reader: jspb.BinaryReader): AnalysisResponse;
}

export namespace AnalysisResponse {
  export type AsObject = {
    currentWords: number,
    currentChars: number,
    status: string,
  }
}

