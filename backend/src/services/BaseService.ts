export class BaseService {

    static async softDelete(

        model: any,

        id: string

    ) {

        const document = await model.findById(id);

        if (!document) {

            return null;

        }

        document.isDeleted = true;

        await document.save();

        return document;

    }

    static async restore(

        model: any,

        id: string

    ) {

        const document = await model.findById(id);

        if (!document) {

            return null;

        }

        document.isDeleted = false;

        await document.save();

        return document;

    }

}
