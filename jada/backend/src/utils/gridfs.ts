import mongoose from 'mongoose';
import { GridFSBucket, GridFSBucketReadStream, GridFSBucketWriteStream } from 'mongodb';

class GridFSService {
  private bucket: GridFSBucket | null = null;

  constructor() {
    this.initializeBucket();
  }

  private initializeBucket(): void {
    if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
      this.bucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: 'documents'
      });
    } else {
      mongoose.connection.on('connected', () => {
        if (mongoose.connection.db) {
          this.bucket = new GridFSBucket(mongoose.connection.db, {
            bucketName: 'documents'
          });
        }
      });
    }
  }

  getBucket(): GridFSBucket {
    if (!this.bucket) {
      throw new Error('GridFS bucket not initialized');
    }
    return this.bucket;
  }

  createUploadStream(filename: string, metadata?: any): GridFSBucketWriteStream {
    const bucket = this.getBucket();
    return bucket.openUploadStream(filename, {
      metadata: metadata || {}
    });
  }

  createDownloadStream(fileId: mongoose.Types.ObjectId): GridFSBucketReadStream {
    const bucket = this.getBucket();
    return bucket.openDownloadStream(fileId);
  }

  async deleteFile(fileId: mongoose.Types.ObjectId): Promise<void> {
    const bucket = this.getBucket();
    await bucket.delete(fileId);
  }

  async fileExists(fileId: mongoose.Types.ObjectId): Promise<boolean> {
    try {
      const bucket = this.getBucket();
      const files = await bucket.find({ _id: fileId }).toArray();
      return files.length > 0;
    } catch (error) {
      return false;
    }
  }
}

export default new GridFSService(); 