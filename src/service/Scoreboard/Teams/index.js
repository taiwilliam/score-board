import { Team } from '../model'
import { validateTeam, mergeObjects } from '../helper'

// 記分板隊伍
export default class Teams {
    teams = []

    // 設定隊伍
    setTeam(team_id, team) {
        // 驗證參數正確
        validateTeam(team_id, team)
        // 創建隊伍id
        const team_ = this.#createTeam(team_id, team)

        // team_id 存在
        if (this.#teamExist(team_id)) {
            this.#updateTeam(team_id, team_)
        } else {
            this.#storeTeam(team_)
        }
    }

    // 更新隊伍
    #updateTeam(team_id, team) {
        const new_teams = [...this.teams]
        const team_index = new_teams.findIndex(t => t.id === team_id)
        new_teams[team_index] = team

        this.teams = new_teams
    }

    // 儲存隊伍
    #storeTeam(team) {
        // 儲存隊伍後 用id排序
        const sort_teams = [...this.teams, team].sort((a, b) => a.id - b.id)
        this.teams = sort_teams
    }

    // 隊伍存在
    #teamExist(team_id) {
        return this.teams.find(t => t.id === team_id) !== undefined
    }

    // 創建隊伍
    #createTeam(team_id, team) {
        const team_ = { ...team, id: team_id }
        const new_team = mergeObjects(Team, team_)

        return new_team
    }
}
