/* tslint:disable */
/* eslint-disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Marriage {
  personId1?: number;
  personId2?: number;
}

export type Marriages = Marriage[];

export interface FTError {
  code?: number;
  message?: string;
}

export interface Person {
  forename?: string;
  lastname?: string;
  birthname?: string;
  birthdate?: string;
  dayOfDeath?: string;
  placeOfDeath?: string;
  placeOfBirth?: string;
  fatherId?: number;
  motherId?: number;
  avatar?: boolean;
}

export type PersonWithId = Person & { id?: number };

export type Persons = Person[];

export type PersonsWithId = (Person & { id?: number })[];

export namespace person {
  /**
   * @tags Person
   * @name getPerson
   * @summary Gets all persons
   * @request GET:/person/all
   */
  export namespace GetPerson {
    export type RequestQuery = {};
    export type RequestBody = never;
    export type ResponseBody = PersonsWithId;
  }

  /**
   * @tags Person
   * @name personDetail
   * @summary Gets a person
   * @request GET:/person/{id}
   */
  export namespace PersonDetail {
    export type RequestQuery = {};
    export type RequestBody = never;
    export type ResponseBody = PersonWithId;
  }

  /**
   * @tags Person
   * @name personUpdate
   * @summary Update exising person
   * @request PUT:/person/{id}
   */
  export namespace PersonUpdate {
    export type RequestQuery = {};
    export type RequestBody = Person;
    export type ResponseBody = Person;
  }

  /**
   * @tags Person
   * @name personDelete
   * @summary Delete exising person
   * @request DELETE:/person/{id}
   */
  export namespace PersonDelete {
    export type RequestQuery = {};
    export type RequestBody = never;
    export type ResponseBody = Person;
  }

  /**
   * @tags Person
   * @name personCreate
   * @summary Add a new person
   * @request POST:/person
   */
  export namespace PersonCreate {
    export type RequestQuery = {};
    export type RequestBody = Person;
    export type ResponseBody = Person;
  }

  /**
   * @tags Person
   * @name avatarCreate
   * @summary Uploads avatar picture
   * @request POST:/person/{id}/avatar
   */
  export namespace AvatarCreate {
    export type RequestQuery = {};
    export type RequestBody = { AvatarPicture?: File };
    export type ResponseBody = { avatarId?: string };
  }
}
export namespace marriage {
  /**
   * @tags Marriage
   * @name getMarriage
   * @summary Gets all marriages
   * @request GET:/marriage/all
   */
  export namespace GetMarriage {
    export type RequestQuery = {};
    export type RequestBody = never;
    export type ResponseBody = Marriages;
  }

  /**
   * @tags Marriage
   * @name marriageCreate
   * @summary Add a new marriage between two person
   * @request POST:/marriage
   */
  export namespace MarriageCreate {
    export type RequestQuery = {};
    export type RequestBody = any;
    export type ResponseBody = Marriage;
  }

  /**
   * @tags Marriage
   * @name marriageDelete
   * @summary Delete exising marriage
   * @request DELETE:/marriage/{id}
   */
  export namespace MarriageDelete {
    export type RequestQuery = {};
    export type RequestBody = never;
    export type ResponseBody = Marriage;
  }
}
