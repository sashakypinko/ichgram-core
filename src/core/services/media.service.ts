import {ApiService, Injectable, InternalServerErrorException} from 'light-kite';
import FormData from 'form-data';
import {IMedia} from '../models/media.model';

@Injectable()
class MediaService extends ApiService {
  constructor() {
    super({
      baseURL: process.env.MEDIA_SERVICE_URL || '',
    });
  }

  async store(file: Express.Multer.File): Promise<IMedia> {
    try {
      const formData = new FormData();
      formData.append('file', file.buffer, file.originalname);
      
      const res = await this.post('store', formData).then((res) => res.data);
      return res.data;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: string): Promise<IMedia> {
    try {
      const res = await this.delete(id).then((res) => res.data);
      return res.data;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

}

export default MediaService;