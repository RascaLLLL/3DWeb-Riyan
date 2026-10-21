import Link from "next/link";
import { explorationCompletionMessage } from "@/data/quests";
import { questRecords } from "@/systems/exploration/progress";
import { questLocationName } from "@/systems/exploration/map";
import { Button } from "@/components/ui/button";
import { InterfaceIcon } from "@/components/ui/interface-icon";
import type { ExplorationProgress, QuestId, QuestRecord } from "@/types/quest";

export function QuestJournal({ progress, select, showMap }: {
  progress: ExplorationProgress; select: (id: QuestId | null) => void; showMap: () => void;
}) {
  const records = questRecords(progress), completed = records.filter((quest) => quest.status === "completed");
  const active = records.find((quest) => quest.status === "active");
  const remaining = records.filter((quest) => quest.status === "not-started");
  const entry = (quest: QuestRecord) => <li key={quest.id} className={`quest-entry quest-${quest.status}`}>
    <div className="quest-entry-heading"><h4>{quest.title}</h4><span className="quest-status">{quest.status === "completed" && <InterfaceIcon name="check" />}{quest.status === "completed" ? "Completed" : quest.status === "active" ? "Active" : "Not started"}</span></div>
    <p>{quest.description}</p><p className="quest-instruction">{quest.instruction}</p>
    <p className="quest-destination">{questLocationName(quest)} · {quest.discovery}</p>
    {quest.status !== "completed" && <div className="quest-actions">
      <Button className="button-small button-secondary" onClick={() => select(quest.status === "active" ? null : quest.id)}>{quest.status === "active" ? "Stop tracking" : "Track objective"}</Button>
      {quest.status === "active" && <Button className="button-small button-secondary" onClick={showMap}>Find on map</Button>}
    </div>}
  </li>;
  return <div className="quest-journal">
    <p className="exploration-note">A few paths to follow, in any order. Every portfolio record is already open to you.</p>
    <div className="journal-progress"><label htmlFor="discovery-progress">Exploration · {completed.length} of {records.length} discovered</label>
      <progress id="discovery-progress" max={records.length} value={completed.length} />
      {completed.length === records.length && <p className="discovery-complete" role="status">{explorationCompletionMessage}</p>}
    </div>
    <section aria-labelledby="current-objective-heading"><h3 id="current-objective-heading">Current objective</h3>
      {active ? <ol className="quest-entries">{entry(active)}</ol> : <p className="journal-empty">No objective tracked. Choose a path below, or wander freely.</p>}</section>
    {remaining.length > 0 && <section aria-labelledby="other-objectives-heading"><h3 id="other-objectives-heading">An invitation to explore</h3><ol className="quest-entries">{remaining.map(entry)}</ol></section>}
    <section aria-labelledby="completed-objectives-heading"><h3 id="completed-objectives-heading">Completed discoveries · {completed.length}</h3>
      {completed.length ? <ol className="quest-entries">{completed.map(entry)}</ol> : <p className="journal-empty">Your first conversation or visit will be recorded here.</p>}</section>
    <p className="journal-footer"><Link href="/portfolio">Read the complete Quick Portfolio</Link> at any time. Discoveries do not unlock or restrict content.</p>
  </div>;
}
