var dataTool=require("./dataTool");export function JL_ICC_Menu3F00(){return"00A40000023F00"};export function JL_ICC_Menu1001(){return"00A40000021001"};export function JL_ICC_File0015(){return"00B095002B"};export function JL_ICC_File0016(){return"00B0960037"};export function JL_ICC_Balance(){return"805C000204"};export function JL_ICC_Rand(len){var len_hex=dataTool.tenToHex(len,2);return"00840000"+len_hex};export function JL_ICCC_PIN(pinCode){return"00200000"+dataTool.tenToHex(pinCode.length/2,2)+pinCode};export function JL_ICC_RetainFile(file_cmd,len){return"00B0"+file_cmd+"00"+len};export function JL_ICC_CreditInit(keyIndex,terminalNo,money){return"805000020B"+keyIndex+money+terminalNo+"10"};export function JL_ICC_CreditForLoad(time,mac2){return"805200000B"+time+mac2+"04"};export function JL_ESAM_Menu3F00(){return"00A40000023F00"};export function JL_ESAM_MenuDF01(){return"00A4000002DF01"};export function JL_ESAM_FileSystem(p1,p2){return"00B081"+p1+p2};export function JL_ESAM_FileCar(random,len){return"00B400000A"+random+len+"00"};export function JL_ESAM_Random(len){return"00840000"+len};