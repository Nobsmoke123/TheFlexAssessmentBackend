import { NormalizedReview } from 'src/common/types';

export abstract class IntegrationAdapter {
  abstract normalize(raw: any): NormalizedReview;

  normalizeBulk(result: any[]): NormalizedReview[] {
    return result.map((value) => this.normalize(value));
  }
}
