import FileSaver from 'file-saver';
import { surpriseMePrompts } from '../constants';

export function getRandomPrompt(prompt) {
  const randomIndex = Math.floor(Math.random() * surpriseMePrompts.length);
  const randomPrompt = surpriseMePrompts[randomIndex];

  if (randomPrompt === prompt) return getRandomPrompt(prompt);

  return randomPrompt;
}

export async function downloadImage(_id, photo) {
  // // Step 1: Convert the buffer data to a Blob object (if not already a Blob)
  // const blob1 = photo instanceof Blob ? photo : new Blob([photo], { type: 'image/jpeg' }); // Adjust the type accordingly
  // // Step 2: Save the Blob object as a file using the FileSaver library
  console.log(photo);
  FileSaver.saveAs(photo, `download-${_id}.jpg`);
}
