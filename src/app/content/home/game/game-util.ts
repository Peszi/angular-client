export class GameUtil {

  static readonly ZONE_COLORS = ['#00acc1', '#ff4350', '#ffbf46'];

  static readonly ZONE_CAPTURING_ICON = 'fas fa-crosshairs spin-animate';
  static readonly ZONE_CAPTURED_ICON = 'fas fa-podcast';
  static readonly ZONE_FREE_ICON = 'fas fa-bullseye';

  static readonly ZONE_CAPTURING_TITLE = '(capturing...)';
  static readonly ZONE_FREE_TITLE = '(free zone)';

  static getZoneColor(idx: number) {
    if (idx < this.ZONE_COLORS.length) {
      return this.ZONE_COLORS[idx];
    }
    return this.ZONE_COLORS[0];
  }

  static getAllyIconUrl(alive: boolean) {
    if (alive) { return '../assets/ally_alive.png'; }
    return '../assets/ally.png';
  }
}
