// Single File Upload
import { pinata } from '@/libs/pinata';
import FormData from 'form-data';

import { _log } from './_log';

export async function uploadFileToPinataIPFS(file: File) {
  try {
    // const formData = new FormData();

    // formData.append('file', file);

    // const options = JSON.stringify({
    //   cidVersion: 0,
    // });

    // formData.append('pinataOptions', options);
    _log('respon222', file);

    // const res = await pinata.pinFileToIPFS(formData);

    // return formData;
  } catch (error) {
    return error;
  }
}
