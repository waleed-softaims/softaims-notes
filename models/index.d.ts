import { ModelInit, MutableModel } from "@aws-amplify/datastore";

type NotesMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Notes {
  readonly id: string;
  readonly title?: string | null;
  readonly Content?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Notes, NotesMetaData>);
  static copyOf(source: Notes, mutator: (draft: MutableModel<Notes, NotesMetaData>) => MutableModel<Notes, NotesMetaData> | void): Notes;
}