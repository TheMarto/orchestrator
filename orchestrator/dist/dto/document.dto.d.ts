export declare class IndexDocumentDto {
    content: string;
    fileName: string;
    source?: string;
}
export declare class IndexMultipleDocumentsDto {
    documents: IndexDocumentDto[];
}
export declare class IndexFromFileDto {
    filePath: string;
    source?: string;
}
