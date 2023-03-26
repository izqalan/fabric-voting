import ElectionCard from "@/components/elements/electionCard"
import { addDays, subDays } from "date-fns"

export default function Election() {

  return (
    <>
      <ElectionCard
        electionName="Pilihan Raya UM #99"
        electionID="election.1234567890"
        startDate={subDays(new Date(), 2)}
        endDate={addDays(new Date(), 7)}
        createdAt={subDays(new Date(), 2)}
        updatedAt={subDays(new Date(), 1)}
        style={{ marginBottom: 16 }}
      />
      <ElectionCard
        electionName="Pilihan raya kampus UKM #42"
        electionID="election.1234567890"
        startDate={subDays(new Date(), 7)}
        endDate={subDays(new Date(), 2)}
        createdAt={subDays(new Date(), 7)}
        updatedAt={subDays(new Date(), 7)}
        style={{ marginBottom: 16 }}
      />
    </>
  )
}