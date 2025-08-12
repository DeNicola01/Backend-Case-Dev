export type GoalType = 'retirement' | 'short_term' | 'medium_term';

export class Planning {
  constructor(
    public id: string,
    public customerId: string,
    public goalType: GoalType,
    public goalName: string,
    public targetValue: number,
    public targetDate: Date,
    public portfolio: { assetClass: string; percentage: number }[],
    public totalAssets: number,
    public plannedAssets: number
  ) {}

  get alignmentPercentage(): number {
    return (this.plannedAssets / this.totalAssets) * 100;
  }

  get alignmentCategory(): string {
    const p = this.alignmentPercentage;
    if (p > 90) return 'verde';
    if (p <= 90 && p > 70) return 'amarelo-claro';
    if (p <= 70 && p > 50) return 'amarelo-escuro';
    return 'vermelho';
  }
}
